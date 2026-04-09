export interface HeroSlide {
  id: string;
  title_ko: string;
  title_en: string;
  subtitle_ko: string;
  subtitle_en: string;
  image_url: string;
  cta_text_ko: string;
  cta_text_en: string;
  cta_href: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  image_url: string;
  category: string;
  features_ko: string[];
  features_en: string[];
  applications_ko: string[];
  applications_en: string[];
  specifications: Record<string, string>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoreValue {
  id: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  image_url: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: string;
  label_ko: string;
  label_en: string;
  value: string;
  suffix: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  section_key: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HistoryItem {
  id: string;
  year: number;
  month: number | null;
  event_ko: string;
  event_en: string;
  order_index: number;
  created_at: string;
}

export interface TrackRecord {
  id: string;
  client_name_ko: string;
  client_name_en: string;
  project_ko: string;
  project_en: string;
  year: number;
  category: string;
  order_index: number;
  created_at: string;
}

export interface Resource {
  id: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  file_url: string;
  thumbnail_url: string | null;
  file_type: string;
  file_size: number;
  download_count: number;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  is_pinned: boolean;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  product_interest: string | null;
  message: string;
  locale: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CatalogDownload {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  resource_id: string | null;
  locale: string;
  created_at: string;
}

export interface SiteSection {
  id: string;
  section_key: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}
