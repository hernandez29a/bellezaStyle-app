import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    // ? Patron Repositorio
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    createProductDto.status = true;
    try {
      const product = await this.productModel.create(createProductDto);
      return product;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const termino = paginationDto.term;
    const regex = new RegExp(termino, 'i');

    const [total, products] = await Promise.all([
      this.productModel.countDocuments(),
      this.productModel
        .find()
        .limit(limit)
        .skip(pagination)
        .select('-__v')
        .or([{ name: regex }, { email: regex }]),
      //.where({ name: termino.toLocaleLowerCase().trim() }),
    ]);
    const totalpages = Math.ceil((total * 1) / limit);
    const paginating = {
      before: offset - 1,
      current: offset,
      after: offset + 1,
      total,
      totalpages,
    };
    return { products, paginating };
  }

  async findOne(id: string) {
    let product: Product;

    if (!product && isValidObjectId(id)) {
      product = await this.productModel.findById(id);
    }

    if (!product) {
      throw new NotFoundException(
        `User with id, name: ${id} it's not in the bd`,
      );
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let product: Product;

    try {
      product = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true,
        },
      );
      return product;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async remove(id: string) {
    let product: Product;
    try {
      product = await this.productModel.findByIdAndUpdate(
        id,
        { status: false },
        {
          new: true,
        },
      );
      return product;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }
}
