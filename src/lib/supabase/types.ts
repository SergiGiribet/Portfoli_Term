export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id:        string;
          no:        string;
          org:       string;
          cjk:       string;
          kind:      string;
          img:       string;
          href:      string;
          tags:      string[];
          role:      string;
          year:      string;
          name:      string;
          desc_cat:  string;
          desc_es:   string;
          desc_en:   string;
          long_cat:  string;
          long_es:   string;
          long_en:   string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:        string;
          no:         string;
          org?:       string;
          cjk?:       string;
          kind?:      string;
          img?:       string;
          href?:      string;
          tags?:      string[];
          role?:      string;
          year?:      string;
          name:       string;
          desc_cat?:  string;
          desc_es?:   string;
          desc_en?:   string;
          long_cat?:  string;
          long_es?:   string;
          long_en?:   string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          no?:        string;
          org?:       string;
          cjk?:       string;
          kind?:      string;
          img?:       string;
          href?:      string;
          tags?:      string[];
          role?:      string;
          year?:      string;
          name?:      string;
          desc_cat?:  string;
          desc_es?:   string;
          desc_en?:   string;
          long_cat?:  string;
          long_es?:   string;
          long_en?:   string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views:   Record<string, never>;
    Functions: Record<string, never>;
    Enums:   Record<string, never>;
  };
}

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
