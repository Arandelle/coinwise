export interface Category {
  _id: string,
  category_name: string;
  type: string,
  icon: string;
  color?: string;
  group_id: string;

  category_group?: string
}

export type CategoryGroup = {
  _id: string;
  group_name: string;
  type: string
};


export interface GroupWithCategories {
  _id?: string;
  group_name: string;
  type: string;
  created_at: string;
  categories: Category[];
}

export type CreateCategory = Omit<Category, "_id">;
export type UpdateCategoryInput = Partial<Omit<Category, "_id">>