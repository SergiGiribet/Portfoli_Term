export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id:         string;
          no:         string;
          org:        string;
          cjk:        string;
          kind:       string;
          img:        string;
          href:       string;
          tags:       string[];
          role:       string;
          year:       string;
          name:       string;
          desc_cat:   string;
          desc_es:    string;
          desc_en:    string;
          long_cat:   string;
          long_es:    string;
          long_en:    string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:         string;
          no:          string;
          org?:        string;
          cjk?:        string;
          kind?:       string;
          img?:        string;
          href?:       string;
          tags?:       string[];
          role?:       string;
          year?:       string;
          name:        string;
          desc_cat?:   string;
          desc_es?:    string;
          desc_en?:    string;
          long_cat?:   string;
          long_es?:    string;
          long_en?:    string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:         string;
          no?:         string;
          org?:        string;
          cjk?:        string;
          kind?:       string;
          img?:        string;
          href?:       string;
          tags?:       string[];
          role?:       string;
          year?:       string;
          name?:       string;
          desc_cat?:   string;
          desc_es?:    string;
          desc_en?:    string;
          long_cat?:   string;
          long_es?:    string;
          long_en?:    string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      channels: {
        Row:    { id: string; label: string; value: string; href: string; live: boolean; sort_order: number; created_at: string; updated_at: string; };
        Insert: { id?: string; label: string; value?: string; href?: string; live?: boolean; sort_order?: number; created_at?: string; updated_at?: string; };
        Update: { id?: string; label?: string; value?: string; href?: string; live?: boolean; sort_order?: number; created_at?: string; updated_at?: string; };
      };

      messages: {
        Row:    { id: string; name: string; email: string; subject: string; body: string; read: boolean; archived: boolean; created_at: string; reply: string | null; replied_at: string | null; };
        Insert: { id?: string; name: string; email: string; subject?: string; body: string; read?: boolean; archived?: boolean; created_at?: string; reply?: string | null; replied_at?: string | null; };
        Update: { id?: string; name?: string; email?: string; subject?: string; body?: string; read?: boolean; archived?: boolean; created_at?: string; reply?: string | null; replied_at?: string | null; };
      };

      profile: {
        Row:    { id: number; sheet: Json; bio1_cat: string; bio1_es: string; bio1_en: string; bio2_cat: string; bio2_es: string; bio2_en: string; stack: Json; updated_at: string; };
        Insert: { id?: number; sheet?: Json; bio1_cat?: string; bio1_es?: string; bio1_en?: string; bio2_cat?: string; bio2_es?: string; bio2_en?: string; stack?: Json; updated_at?: string; };
        Update: { id?: number; sheet?: Json; bio1_cat?: string; bio1_es?: string; bio1_en?: string; bio2_cat?: string; bio2_es?: string; bio2_en?: string; stack?: Json; updated_at?: string; };
      };

      cv_data: {
        Row:    { id: number; identity: Json; experience: Json; education: Json; skills: Json; languages: Json; volunteering: Json; updated_at: string; };
        Insert: { id?: number; identity?: Json; experience?: Json; education?: Json; skills?: Json; languages?: Json; volunteering?: Json; updated_at?: string; };
        Update: { id?: number; identity?: Json; experience?: Json; education?: Json; skills?: Json; languages?: Json; volunteering?: Json; updated_at?: string; };
      };

      settings: {
        Row:    { id: number; display_name: string; slogan: string; accent: string; default_lang: string; scanlines: boolean; boot_sequence: boolean; hud_cursor: boolean; updated_at: string; sub_name: string; coords: string; year: string; contact_cat: string; contact_es: string; contact_en: string; };
        Insert: { id?: number; display_name?: string; slogan?: string; accent?: string; default_lang?: string; scanlines?: boolean; boot_sequence?: boolean; hud_cursor?: boolean; updated_at?: string; sub_name?: string; coords?: string; year?: string; contact_cat?: string; contact_es?: string; contact_en?: string; };
        Update: { id?: number; display_name?: string; slogan?: string; accent?: string; default_lang?: string; scanlines?: boolean; boot_sequence?: boolean; hud_cursor?: boolean; updated_at?: string; sub_name?: string; coords?: string; year?: string; contact_cat?: string; contact_es?: string; contact_en?: string; };
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
}

export type ProjectRow  = Database["public"]["Tables"]["projects"]["Row"];
export type ChannelRow  = Database["public"]["Tables"]["channels"]["Row"];
export type MessageRow  = Database["public"]["Tables"]["messages"]["Row"];
export type ProfileRow  = Database["public"]["Tables"]["profile"]["Row"];
export type CvRow       = Database["public"]["Tables"]["cv_data"]["Row"];
export type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];
