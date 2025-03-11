import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// User related functions
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStatus(userId: string, status: string) {
  const { error } = await supabase
    .from("users")
    .update({ status, last_seen: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw error;
}

// Friends related functions
export async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      status,
      friend:friend_id(id, name, avatar_url, status, last_seen)
    `,
    )
    .eq("user_id", userId)
    .eq("status", "accepted");

  if (error) throw error;
  return data;
}

// Messages related functions
export async function getMessages(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessagesAsRead(userId: string, friendId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("sender_id", friendId)
    .eq("receiver_id", userId)
    .eq("read", false);

  if (error) throw error;
}

// Typing indicator functions
export async function setTypingStatus(
  userId: string,
  friendId: string,
  isTyping: boolean,
) {
  const { error } = await supabase.from("user_typing").upsert(
    {
      user_id: userId,
      chat_with_user_id: friendId,
      is_typing: isTyping,
    },
    { onConflict: "user_id, chat_with_user_id" },
  );

  if (error) throw error;
}

export async function subscribeToMessages(
  userId: string,
  callback: (payload: any) => void,
) {
  return supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe();
}

export async function subscribeToTypingStatus(
  userId: string,
  callback: (payload: any) => void,
) {
  return supabase
    .channel("typing")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_typing",
        filter: `chat_with_user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe();
}

export async function subscribeToUserStatus(callback: (payload: any) => void) {
  return supabase
    .channel("users")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `status=in.(online,offline)`,
      },
      callback,
    )
    .subscribe();
}
