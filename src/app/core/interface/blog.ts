
export interface Blog {
  id: number;
  title:string;
  slug:string;
  content?:string;
  sub_title?: string;
  main_image?:string;
  second_image?:string;
  tags?:string;
  publish?:boolean;
  author_id?:string;
  created_at?:string;
}