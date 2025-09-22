export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured?: boolean;
}
