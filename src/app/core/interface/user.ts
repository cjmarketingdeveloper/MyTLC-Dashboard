export interface User {
  id: number;
  name: string;
  surname: string;
  roles?: string;
  profile_pic?: string;
  email: string;
  phone?: string;
  profession?: string;
  bio?: string;
}