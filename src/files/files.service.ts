import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync } from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { User } from 'src/user/entities/user.entity';
import * as fs from 'fs';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class FilesService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    // ? Patron Repositorio
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  getStaticFile(imageName: string, coleccion: string) {
    const path = join(__dirname, `../../static/${coleccion}`, imageName);
    if (!existsSync(path)) {
      throw new BadRequestException(
        `No ${coleccion} found with image: ${imageName}`,
      );
    }
    return path;
  }

  //? metodo para salvar inagel de perfil en la bd
  async updateFile(id: string, img: string, coleccion: string) {
    switch (coleccion) {
      case 'user':
        // ? Validar que el usuario exista en la bd
        let user = await this.userModel.findById(id);
        if (!user) {
          throw new NotFoundException(
            `usuario con el id: ${id} no estan en la bd`,
          );
        }

        if (user.img) {
          const pathImage = join(
            __dirname,
            `../../static/${coleccion}`,
            user.img,
          );
          //console.log(pathImage);
          if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
          }
          user.img = img;
          user = await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
          });
          return user;
        }

        break;

      case 'product':
        // ? Validar que el usuario exista en la bd
        let product = await this.productModel.findById(id);
        if (!product) {
          throw new NotFoundException(
            `product con el id: ${id} no estan en la bd`,
          );
        }

        if (product.img) {
          const pathImage = join(
            __dirname,
            `../../static/${coleccion}`,
            product.img,
          );
          //console.log(pathImage);
          if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
          }
          product.img = img;
          product = await this.productModel.findByIdAndUpdate(id, product, {
            new: true,
          });

          return product;
        }

        break;

      default:
        return 'por determinar';
    }
  }
}
