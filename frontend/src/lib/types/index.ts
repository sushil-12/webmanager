export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  navItems:any;
  setNavItems: any;
  rerender:boolean,
  setRerender: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDomain: (newDomain: string) => Promise<void>; // Updated type to accept a string
  currentDomain: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
  type:string;
  category:string;
  subcategory?:any;
  id?:string;
};

export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  bio:string;
  profile_pic: string,
  permissions: Array<string>,
  isEmailVerified?: boolean,
  temp_email?: string,
};

export type INewUser = {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  user_type?:string;
  username: string;
};

export type MediaItem = {
  id: string,
  title: string,
  tempUrl: string,
  caption: string,
  description: string,
  alt_text: string,
  filename: string,
  cloudinary_id: string,
  url: string,
  format:string,
  width:string,
  height:string,
  resource_type:string,
  size: any,
  storage_type: string
  author: string,
  category: string,
  tags: string,
  createdAt: string,
  domain: string,
}

export type MediaItemCopy = {
  id: string,
  title: string,
  tempUrl: string,
  isLoading: boolean,
  caption: string,
  description: string,
  alt_text: string,
  filename: string,
  cloudinary_id: string,
  url: string,
  size: string,
  storage_type: string
  author: string,
  category: string,
  tags: string,
  createdAt: string,
}
export type PostModel = {
  id: string,
  title: string,
  content: string,
  author: string,
  publicationDate: Date,
  categories: string[],
  categoryObject?:any,
  tags: string[],
  featuredImage: any,
  status: string,
  slug:string,
  postMeta?:any,
  seoData?:any
  // comments: [{ user: String, content: String, date: Date, default: Date.now, }, },],
}

export type CategoryModel = {
  id: string,
  name: string,
  slug: string,
  postType: string,
  description: string,
  parentCategory: string,
}

export type CategoryKeyModel = {
  data: string,
  key: string,
  slug:string,
  label: string,
  children: any
}

export type IMenuItem = {
  id: string;
  imgURL: string;
  route: string;
  label: string;
  category: boolean;
  type: string;
};

export type IWebsite = {
  id: string,
  icon?: string;
  business_name: string;
  url: string;
  description?: string;
  menus?: IMenuItem[];
  created_by?: string; // Assuming the created_by field is optional
};