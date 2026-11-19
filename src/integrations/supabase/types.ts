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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      counterfeit_listings: {
        Row: {
          anomalies: string[]
          confidence: number
          created_at: string
          date_detected: string
          evidence_ref: string
          gtin: string
          id: string
          platform: string
          price_delta: string
          region: string
          seller: string
          sku: string
          status: string
          target_product: string
        }
        Insert: {
          anomalies?: string[]
          confidence?: number
          created_at?: string
          date_detected?: string
          evidence_ref?: string
          gtin?: string
          id: string
          platform?: string
          price_delta?: string
          region?: string
          seller?: string
          sku?: string
          status?: string
          target_product: string
        }
        Update: {
          anomalies?: string[]
          confidence?: number
          created_at?: string
          date_detected?: string
          evidence_ref?: string
          gtin?: string
          id?: string
          platform?: string
          price_delta?: string
          region?: string
          seller?: string
          sku?: string
          status?: string
          target_product?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          confidence: number
          created_at: string
          date: string
          entity: string
          id: string
          investigation: string
          name: string
          source: string
          status: string
          text: string
          type: string
          url: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          date?: string
          entity?: string
          id: string
          investigation?: string
          name: string
          source?: string
          status?: string
          text?: string
          type?: string
          url?: string
        }
        Update: {
          confidence?: number
          created_at?: string
          date?: string
          entity?: string
          id?: string
          investigation?: string
          name?: string
          source?: string
          status?: string
          text?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      investigations: {
        Row: {
          confidence: number
          created_at: string
          date: string
          description: string | null
          domain: string
          evidence: number
          id: string
          identifier: string | null
          risk_score: number
          severity: string
          status: string
          title: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          date?: string
          description?: string | null
          domain: string
          evidence?: number
          id: string
          identifier?: string | null
          risk_score?: number
          severity?: string
          status?: string
          title: string
        }
        Update: {
          confidence?: number
          created_at?: string
          date?: string
          description?: string | null
          domain?: string
          evidence?: number
          id?: string
          identifier?: string | null
          risk_score?: number
          severity?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      recall_match_decisions: {
        Row: {
          decision: string
          match_id: string
          updated_at: string
        }
        Insert: {
          decision: string
          match_id: string
          updated_at?: string
        }
        Update: {
          decision?: string
          match_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          category: string
          certifications: string[]
          city: string
          country: string
          created_at: string
          downstream_products: string[]
          esg_score: number
          id: string
          last_audit_date: string
          lead_time_days: number
          lei_code: string
          name: string
          notes: string
          risk: number
          severity: string
          single_source: boolean
          status: string
          tier: number
        }
        Insert: {
          category?: string
          certifications?: string[]
          city?: string
          country: string
          created_at?: string
          downstream_products?: string[]
          esg_score?: number
          id: string
          last_audit_date?: string
          lead_time_days?: number
          lei_code?: string
          name: string
          notes?: string
          risk?: number
          severity?: string
          single_source?: boolean
          status?: string
          tier?: number
        }
        Update: {
          category?: string
          certifications?: string[]
          city?: string
          country?: string
          created_at?: string
          downstream_products?: string[]
          esg_score?: number
          id?: string
          last_audit_date?: string
          lead_time_days?: number
          lei_code?: string
          name?: string
          notes?: string
          risk?: number
          severity?: string
          single_source?: boolean
          status?: string
          tier?: number
        }
        Relationships: []
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
