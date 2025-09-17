export interface CreateProductDto {
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  isFeatured?: boolean;
}
