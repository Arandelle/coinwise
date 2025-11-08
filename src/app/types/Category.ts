export interface Category {
  _id: string,
  category_name: string;
  type: string,
  icon: string;
  color?: string;
  category_group: string;
}

export type CreateCategory = Omit<Category, "_id">;
export type UpdateCategoryInput = Partial<Omit<Category, "_id">>