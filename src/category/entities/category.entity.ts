/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose/dist';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';

@Schema()
export class Category extends Document {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  title: string;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products: Types.Array<Product>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.method('toJSON', function () {
  const { __v, ...category } = this.toObject();

  return category;
});
