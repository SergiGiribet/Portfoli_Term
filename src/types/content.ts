export type Lang = "CAT" | "ES" | "EN";

export interface I18n<T> {
  CAT: T;
  ES: T;
  EN: T;
}

export interface Identity {
  displayName: string;
  subName: string;
  slogan: string;
  heroImage: string;
  status: I18n<string>;
  location: string;
  coords: string;
  year: string;
}

export interface NavLabels {
  index: string;
  profile: string;
  work: string;
  contact: string;
}

export interface HeroRoles {
  developer: string;
  student: string;
  founder: string;
}

export interface Bio {
  p1: string;
  p2: string;
}

export interface DataSheetRow {
  k: string;
  v: string;
}

export interface StackGroup {
  label: string;
  items: string;
}

export interface Project {
  no: string;
  org: string;
  name: string;
  kind: string;
  cjk: string;
  role: string;
  year: string;
  tags: string[];
  href: string;
  img: string;
  desc: I18n<string>;
  long: I18n<string>;
}

export interface Channel {
  label: string;
  val: string;
  href: string;
}

export interface CvEntry {
  role: string;
  org: string;
  meta: string;
}

export interface CvVolunteering {
  role: string;
  org: string;
  meta: string;
  desc: string;
}

export interface CvSkill {
  k: string;
  v: string;
}

export interface CvLanguage {
  k: string;
  v: string;
}

export interface CvUi {
  download: string;
  close: string;
  secProfile: string;
  secExp: string;
  secEdu: string;
  secVol: string;
  secSkills: string;
  secLang: string;
}

export interface CvData {
  title: string;
  sub: string;
  name: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  file: string;
  ui: CvUi;
  profile: string;
  experience: CvEntry[];
  education: CvEntry[];
  volunteering: CvVolunteering;
  skills: CvSkill[];
  languages: CvLanguage[];
}

export interface Content {
  identity: Identity;
  nav: I18n<NavLabels>;
  hero: { roles: I18n<HeroRoles> };
  bio: I18n<Bio>;
  dataSheet: DataSheetRow[];
  stack: StackGroup[];
  projects: Project[];
  contact: I18n<string>;
  channels: Channel[];
  cv: I18n<CvData>;
}
