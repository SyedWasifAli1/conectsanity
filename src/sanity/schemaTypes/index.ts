import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { order } from './order';
import { products } from './products';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, order,products], // ✅ Dono schemas ko yahan add karo
};
