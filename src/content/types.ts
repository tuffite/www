export type Locale = 'en' | 'zh';
export type Text = Record<Locale, string>;
export const t = (en: string, zh: string): Text => ({ en, zh });
export type Section = {
  id: string;
  title: Text;
  paragraphs?: Text[];
  bullets?: Text[];
  code?: string;
  language?: string;
  note?: Text;
};
export type Article = {
  slug: string;
  group: 'start' | 'application' | 'framework' | 'reference';
  title: Text;
  description: Text;
  sections: Section[];
  kind?: 'rust' | 'javascript' | 'configuration' | 'cli' | 'explorer';
};
