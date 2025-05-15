export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      curriculums: {
        Row: {
          contenido_texto: string | null
          cv_id: number
          fecha_carga: string | null
          formato: string | null
          nombre_archivo: string
          tamano_bytes: number | null
          uploader_id: number
        }
        Insert: {
          contenido_texto?: string | null
          cv_id?: number
          fecha_carga?: string | null
          formato?: string | null
          nombre_archivo: string
          tamano_bytes?: number | null
          uploader_id: number
        }
        Update: {
          contenido_texto?: string | null
          cv_id?: number
          fecha_carga?: string | null
          formato?: string | null
          nombre_archivo?: string
          tamano_bytes?: number | null
          uploader_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "curriculums_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      datos_postulantes: {
        Row: {
          cv_id: number
          educacion: Json | null
          email: string | null
          experiencia: Json | null
          habilidades: string[] | null
          nombre_completo: string | null
          postulante_id: number
          telefono: string | null
        }
        Insert: {
          cv_id: number
          educacion?: Json | null
          email?: string | null
          experiencia?: Json | null
          habilidades?: string[] | null
          nombre_completo?: string | null
          postulante_id?: number
          telefono?: string | null
        }
        Update: {
          cv_id?: number
          educacion?: Json | null
          email?: string | null
          experiencia?: Json | null
          habilidades?: string[] | null
          nombre_completo?: string | null
          postulante_id?: number
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "datos_postulantes_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: true
            referencedRelation: "curriculums"
            referencedColumns: ["cv_id"]
          },
        ]
      }
      predicciones: {
        Row: {
          factores_clave: string[] | null
          fecha_prediccion: string | null
          modelo_utilizado: string | null
          postulante_id: number
          prediccion_id: number
          probabilidad_exito: number | null
        }
        Insert: {
          factores_clave?: string[] | null
          fecha_prediccion?: string | null
          modelo_utilizado?: string | null
          postulante_id: number
          prediccion_id?: number
          probabilidad_exito?: number | null
        }
        Update: {
          factores_clave?: string[] | null
          fecha_prediccion?: string | null
          modelo_utilizado?: string | null
          postulante_id?: number
          prediccion_id?: number
          probabilidad_exito?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "predicciones_postulante_id_fkey"
            columns: ["postulante_id"]
            isOneToOne: true
            referencedRelation: "datos_postulantes"
            referencedColumns: ["postulante_id"]
          },
        ]
      }
      recomendaciones: {
        Row: {
          descripcion: string | null
          fecha_creacion: string | null
          mensaje: string
          recomendacion_id: number
          tipo: string
        }
        Insert: {
          descripcion?: string | null
          fecha_creacion?: string | null
          mensaje: string
          recomendacion_id?: number
          tipo: string
        }
        Update: {
          descripcion?: string | null
          fecha_creacion?: string | null
          mensaje?: string
          recomendacion_id?: number
          tipo?: string
        }
        Relationships: []
      }
      resultados_descriptivos: {
        Row: {
          analisis_id: number
          cv_procesados: number | null
          experiencia_promedio: Json | null
          fecha_analisis: string | null
          habilidades_top: string[] | null
        }
        Insert: {
          analisis_id?: number
          cv_procesados?: number | null
          experiencia_promedio?: Json | null
          fecha_analisis?: string | null
          habilidades_top?: string[] | null
        }
        Update: {
          analisis_id?: number
          cv_procesados?: number | null
          experiencia_promedio?: Json | null
          fecha_analisis?: string | null
          habilidades_top?: string[] | null
        }
        Relationships: []
      }
      sesiones: {
        Row: {
          fecha_expiracion: string
          fecha_inicio: string | null
          sesion_id: string
          token: string
          usuario_id: number
        }
        Insert: {
          fecha_expiracion: string
          fecha_inicio?: string | null
          sesion_id: string
          token: string
          usuario_id: number
        }
        Update: {
          fecha_expiracion?: string
          fecha_inicio?: string | null
          sesion_id?: string
          token?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          contrasena_hash: string
          email: string
          fecha_creacion: string | null
          nombre_usuario: string
          rol: string
          ultimo_login: string | null
          usuario_id: number
        }
        Insert: {
          contrasena_hash: string
          email: string
          fecha_creacion?: string | null
          nombre_usuario: string
          rol?: string
          ultimo_login?: string | null
          usuario_id?: number
        }
        Update: {
          contrasena_hash?: string
          email?: string
          fecha_creacion?: string | null
          nombre_usuario?: string
          rol?: string
          ultimo_login?: string | null
          usuario_id?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
