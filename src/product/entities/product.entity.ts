import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose/dist';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    index: true,
  })
  brand: string;

  @Prop({
    default: 'no-posee-imagen',
  })
  img: string;

  /*@Prop({
    default: 'no-posee-imagen',
  })
  category: string;*/

  @Prop({
    default: 'no hay info',
  })
  description: string;

  @Prop({
    required: true,
  })
  skinTypeProduct: string;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.method('toJSON', function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, ...product } = this.toObject();

  //user.uid = _id;
  return product;
});
