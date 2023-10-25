import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth, GetUser } from 'src/user/decorators';
import { ValidRoles } from 'src/user/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.ESPEC_ROLE)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.ESPEC_ROLE, ValidRoles.USER_ROLE)
  findAll(@Query() paginatioDto: PaginationDto, @GetUser() user: User) {
    return this.categoryService.findAll(paginatioDto, user);
  }

  @Get(':id')
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.ESPEC_ROLE, ValidRoles.USER_ROLE)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.ESPEC_ROLE)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.ESPEC_ROLE)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
