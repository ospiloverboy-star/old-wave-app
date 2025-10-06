export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          auto_response_enabled: boolean | null
          business_hours: Json
          created_at: string | null
          id: string
          message_templates: Json
          notification_email: string | null
          notification_preferences: Json | null
          updated_at: string | null
          whatsapp_business_number: string
        }
        Insert: {
          auto_response_enabled?: boolean | null
          business_hours?: Json
          created_at?: string | null
          id?: string
          message_templates?: Json
          notification_email?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
          whatsapp_business_number: string
        }
        Update: {
          auto_response_enabled?: boolean | null
          business_hours?: Json
          created_at?: string | null
          id?: string
          message_templates?: Json
          notification_email?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
          whatsapp_business_number?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          jersey_id: string
          quantity: number
          size: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jersey_id: string
          quantity?: number
          size: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jersey_id?: string
          quantity?: number
          size?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
        ]
      }
      jersey_requests: {
        Row: {
          additional_notes: string | null
          admin_response: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          inquiry_id: string | null
          jersey_name: string
          last_contacted_at: string | null
          league: string | null
          phone_number: string
          size: string
          status: string | null
          team: string
          updated_at: string
          user_id: string | null
          whatsapp_contacted: boolean | null
        }
        Insert: {
          additional_notes?: string | null
          admin_response?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          inquiry_id?: string | null
          jersey_name: string
          last_contacted_at?: string | null
          league?: string | null
          phone_number: string
          size: string
          status?: string | null
          team: string
          updated_at?: string
          user_id?: string | null
          whatsapp_contacted?: boolean | null
        }
        Update: {
          additional_notes?: string | null
          admin_response?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          inquiry_id?: string | null
          jersey_name?: string
          last_contacted_at?: string | null
          league?: string | null
          phone_number?: string
          size?: string
          status?: string | null
          team?: string
          updated_at?: string
          user_id?: string | null
          whatsapp_contacted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "jersey_requests_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      jerseys: {
        Row: {
          available_sizes: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          league: string
          name: string
          price_naira: number
          season: string
          sizes: string[] | null
          stock_quantity: number | null
          team: string
          updated_at: string
        }
        Insert: {
          available_sizes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          league: string
          name: string
          price_naira?: number
          season: string
          sizes?: string[] | null
          stock_quantity?: number | null
          team: string
          updated_at?: string
        }
        Update: {
          available_sizes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          league?: string
          name?: string
          price_naira?: number
          season?: string
          sizes?: string[] | null
          stock_quantity?: number | null
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          jersey_id: string
          order_id: string
          price: number
          quantity: number
          size: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          jersey_id: string
          order_id: string
          price: number
          quantity?: number
          size: string
        }
        Update: {
          created_at?: string | null
          id?: string
          jersey_id?: string
          order_id?: string
          price?: number
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_city: string
          delivery_state: string
          id: string
          inquiry_number: string | null
          inquiry_type: string | null
          items: Json
          notes: string | null
          order_number: string
          priority_level: string | null
          quoted_price: number | null
          response_time: string | null
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
          whatsapp_sent_at: string | null
          whatsapp_status: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_city: string
          delivery_state: string
          id?: string
          inquiry_number?: string | null
          inquiry_type?: string | null
          items: Json
          notes?: string | null
          order_number: string
          priority_level?: string | null
          quoted_price?: number | null
          response_time?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          delivery_city?: string
          delivery_state?: string
          id?: string
          inquiry_number?: string | null
          inquiry_type?: string | null
          items?: Json
          notes?: string | null
          order_number?: string
          priority_level?: string | null
          quoted_price?: number | null
          response_time?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          delivery_address: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone_number: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          delivery_address?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          delivery_address?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          jersey_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jersey_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jersey_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
