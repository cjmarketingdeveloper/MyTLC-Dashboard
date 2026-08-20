
export interface Blitz {
  id: number;
  title:string;
  slug:string;
  content?:string;
  sub_title?: string;
  publish?:boolean;
  main_image?: string;
  author_id?:string;
  created_at?:string;
  updated_at?:string;
}