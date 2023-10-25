/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    createCategoryDto.status = true;
    createCategoryDto.title = createCategoryDto.title.toLocaleLowerCase();
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const termino = paginationDto.term;
    const regex = new RegExp(termino, 'i');

    // ? mostrar datos para el usuario regular
    //console.log(user.rol);
    const query = { status: true };
    const rolUser = user.rol;
    if (rolUser === 'USER_ROLE') {
      const [totalTReg, categories] = await Promise.all([
        this.categoryModel.countDocuments(query),
        this.categoryModel
          .find()
          .limit(limit)
          .skip(pagination)
          .populate('product')
          .select('-__v')
          .where({ status: true })
          .or([{ title: regex }]),
      ]);
      const totalpages = Math.ceil((totalTReg * 1) / limit);
      const paginating = {
        before: offset - 1,
        current: offset,
        after: offset + 1,
        totalTReg,
        totalpages,
      };
      return { categories, paginating };
      //return { total, diets };
    }

    const [total, categories] = await Promise.all([
      this.categoryModel.countDocuments(),
      this.categoryModel
        .find()
        .limit(limit)
        .skip(pagination)
        .populate('products')
        .select('-__v')
        .or([{ title: regex }]),
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
    return { categories, paginating };

    //return `This action returns all category`;
  }

  async findOne(id: string) {
    let category: Category;
    if (!category && isValidObjectId(id)) {
      category = await this.categoryModel.findById(id).populate('product');
    }

    if (!category) {
      throw new NotFoundException(
        `Category with id,  ${id} it's not in the bd`,
      );
    }
    return category;
    //return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    let category: Category;
    const { status, ...restoData } = updateCategoryDto;

    try {
      category = await this.categoryModel.findByIdAndUpdate(id, restoData, {
        new: true,
      });
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
    //return `This action updates a #${id} category`;
  }

  async remove(id: string) {
    let category: Category;
    try {
      category = await this.categoryModel.findByIdAndUpdate(
        id,
        { status: false },
        {
          new: true,
        },
      );
      return category;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
    //return `This action removes a #${id} category`;
  }
}
