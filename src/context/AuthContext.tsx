import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";
import { updateUserStatus } from "@/lib/supabase-client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Update user status to online if logged in
      if (session?.user) {
        updateUserStatus(session.user.id, "online").catch(console.error);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Update user status based on auth state
      if (session?.user) {
        updateUserStatus(session.user.id, "online").catch(console.error);
      }
    });

    // Set up beforeunload event to update status to offline
    const handleBeforeUnload = () => {
      if (user) {
        // Using a synchronous approach for beforeunload
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`,
          false,
        );
        xhr.setRequestHeader("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Prefer", "return=minimal");
        xhr.send(
          JSON.stringify({
            status: "offline",
            last_seen: new Date().toISOString(),
          }),
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Update status to offline when component unmounts
      if (user) {
        updateUserStatus(user.id, "offline").catch(console.error);
      }
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        name,
        status: "online",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      });

      if (profileError) throw profileError;
    }
  };

  const signOut = async () => {
    // Update status to offline before signing out
    if (user) {
      await updateUserStatus(user.id, "offline");
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
