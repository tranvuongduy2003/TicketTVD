export type Province = {
  name: string;
  slug: string;
  name_with_type: string;
  code: string;
};
export type District = {
  name: string;
  type: string;
  slug: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  code: string;
  parent_code: string;
};
