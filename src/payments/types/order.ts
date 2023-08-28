import { Product } from './Product';
//temporirly will be put here

export interface Order {
  products: Product[];
  currency: string;
}
