export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  private: {
    Tables: {
      lead_rate_limits: {
        Row: {
          accepted_count: number
          key_hash: string
          updated_at: string
          window_started_at: string
        }
        Insert: {
          accepted_count: number
          key_hash: string
          updated_at?: string
          window_started_at: string
        }
        Update: {
          accepted_count?: number
          key_hash?: string
          updated_at?: string
          window_started_at?: string
        }
        Relationships: []
      }
      lead_submission_receipts: {
        Row: {
          created_at: string
          idempotency_key: string
          lead_id: string
          request_hash: string
        }
        Insert: {
          created_at?: string
          idempotency_key: string
          lead_id: string
          request_hash: string
        }
        Update: {
          created_at?: string
          idempotency_key?: string
          lead_id?: string
          request_hash?: string
        }
        Relationships: []
      }
      product_commercial_data: {
        Row: {
          partner_price_eur: number | null
          points: number | null
          product_id: string
          source_price_valid_from: string | null
          updated_at: string
        }
        Insert: {
          partner_price_eur?: number | null
          points?: number | null
          product_id: string
          source_price_valid_from?: string | null
          updated_at?: string
        }
        Update: {
          partner_price_eur?: number | null
          points?: number | null
          product_id?: string
          source_price_valid_from?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_lead_capture_records: { Args: never; Returns: number }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          channel: string
          consent_given: boolean
          consent_version: string
          consented_at: string | null
          contact: string
          created_at: string
          id: string
          message: string | null
          name: string
          package_interest_id: string | null
          product_interest_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          channel?: string
          consent_given: boolean
          consent_version: string
          consented_at?: string | null
          contact: string
          created_at?: string
          id?: string
          message?: string | null
          name: string
          package_interest_id?: string | null
          product_interest_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel?: string
          consent_given?: boolean
          consent_version?: string
          consented_at?: string | null
          contact?: string
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          package_interest_id?: string | null
          product_interest_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_package_interest_id_fkey"
            columns: ["package_interest_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_product_interest_id_fkey"
            columns: ["product_interest_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      package_products: {
        Row: {
          package_id: string
          product_id: string
          quantity: number
          sort_order: number
        }
        Insert: {
          package_id: string
          product_id: string
          quantity?: number
          sort_order?: number
        }
        Update: {
          package_id?: string
          product_id?: string
          quantity?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "package_products_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          id: string
          name: string
          price_rsd: number | null
          product_codes: string[]
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          price_rsd?: number | null
          product_codes: string[]
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          price_rsd?: number | null
          product_codes?: string[]
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          article_number: string
          catalogue_price_eur: number | null
          catalogue_source_code: string | null
          category: string
          created_at: string
          currency: string
          id: string
          image_path: string | null
          image_source_url: string | null
          name: string
          package_content: string | null
          price_valid_from: string | null
          product_source_url: string | null
          short_description: string | null
          slug: string
          sort_order: number
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          article_number: string
          catalogue_price_eur?: number | null
          catalogue_source_code?: string | null
          category: string
          created_at?: string
          currency?: string
          id?: string
          image_path?: string | null
          image_source_url?: string | null
          name: string
          package_content?: string | null
          price_valid_from?: string | null
          product_source_url?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          article_number?: string
          catalogue_price_eur?: number | null
          catalogue_source_code?: string | null
          category?: string
          created_at?: string
          currency?: string
          id?: string
          image_path?: string | null
          image_source_url?: string | null
          name?: string
          package_content?: string | null
          price_valid_from?: string | null
          product_source_url?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      submit_lead: {
        Args: {
          p_consent_given: boolean
          p_contact: string
          p_idempotency_key: string
          p_ip_hash: string
          p_message?: string
          p_name: string
          p_package_interest_id?: string
        }
        Returns: boolean
      }
      submit_product_lead: {
        Args: {
          p_consent_given: boolean
          p_contact: string
          p_idempotency_key: string
          p_ip_hash: string
          p_message?: string
          p_name: string
          p_package_interest_id?: string
          p_product_interest_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
  private: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
