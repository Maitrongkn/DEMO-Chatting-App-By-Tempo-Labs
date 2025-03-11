export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      friends: {
        Row: {
          created_at: string;
          id: string;
          status: string;
          user_id: string;
          friend_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          status?: string;
          user_id: string;
          friend_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          status?: string;
          user_id?: string;
          friend_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friends_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_friend_id_fkey";
            columns: ["friend_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          receiver_id: string;
          sender_id: string;
          read: boolean;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          receiver_id: string;
          sender_id: string;
          read?: boolean;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          receiver_id?: string;
          sender_id?: string;
          read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          id: string;
          last_seen: string | null;
          name: string;
          status: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          last_seen?: string | null;
          name: string;
          status?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          last_seen?: string | null;
          name?: string;
          status?: string;
        };
        Relationships: [];
      };
      user_typing: {
        Row: {
          created_at: string;
          id: string;
          is_typing: boolean;
          user_id: string;
          chat_with_user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_typing: boolean;
          user_id: string;
          chat_with_user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_typing?: boolean;
          user_id?: string;
          chat_with_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_typing_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_typing_chat_with_user_id_fkey";
            columns: ["chat_with_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
