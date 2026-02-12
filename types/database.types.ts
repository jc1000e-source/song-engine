export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          owner_id: string
          join_code: string
          song_credits_remaining: number
          total_credits_purchased: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          join_code?: string
          song_credits_remaining?: number
          total_credits_purchased?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          join_code?: string
          song_credits_remaining?: number
          total_credits_purchased?: number
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          team_id: string
          created_by_user_id: string | null
          title: string | null
          lyrics: string | null
          genre: string | null
          status: string
          audio_url: string | null
          consumed_credit_id: string | null
          week_start_date: string | null
          week_end_date: string | null
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          created_by_user_id?: string | null
          title?: string | null
          lyrics?: string | null
          genre?: string | null
          status?: string
          audio_url?: string | null
          consumed_credit_id?: string | null
          week_start_date?: string | null
          week_end_date?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string
          created_by_user_id?: string | null
          title?: string | null
          lyrics?: string | null
          genre?: string | null
          status?: string
          audio_url?: string | null
          consumed_credit_id?: string | null
          week_start_date?: string | null
          week_end_date?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      accomplishments: {
        Row: {
          id: string
          team_id: string
          user_id: string | null
          text: string
          used_in_song: boolean
          used_in_song_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id?: string | null
          text: string
          used_in_song?: boolean
          used_in_song_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string | null
          text?: string
          used_in_song?: boolean
          used_in_song_id?: string | null
          created_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          team_id: string
          transaction_type: string
          amount: number
          balance_after: number
          stripe_payment_id: string | null
          song_id: string | null
          user_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          transaction_type: string
          amount: number
          balance_after: number
          stripe_payment_id?: string | null
          song_id?: string | null
          user_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          transaction_type?: string
          amount?: number
          balance_after?: number
          stripe_payment_id?: string | null
          song_id?: string | null
          user_id?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          can_grant_credits: boolean
          can_view_analytics: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          can_grant_credits?: boolean
          can_view_analytics?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          can_grant_credits?: boolean
          can_view_analytics?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
