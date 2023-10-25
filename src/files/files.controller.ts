import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  Body,
  Param,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from 'src/common/helper';
import { Response } from 'express';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':coleccion/:imageName')
  findFile(
    @Res() res: Response,
    @Param('imageName') imageName: string,
    @Param('coleccion') coleccion: string,
  ) {
    const path = this.filesService.getStaticFile(imageName, coleccion);
    res.sendFile(path);
    //return path;
  }

  @Post(':coleccion/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: fileFilter,
      limits: { fileSize: 1000000 },
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, `./static/${req.params.coleccion}`);
        },
        filename: fileNamer,
      }),
    }),
  )
  async uploadUserFile(
    @Param('id', ParseMongoIdPipe) id: string,
    @Param('coleccion') coleccion: string,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Make sure that file is an image');
    }

    if (!['user', 'product'].includes(coleccion)) {
      throw new BadRequestException('Invalid collection');
    }

    /*const secureUrl = `${this.configService.get('HOST_API')}/files/user/${
      image.filename
    }`;*/
    //console.log(image.filename);
    // ? guardar imagen en la bd asignada al usuario
    return this.filesService.updateFile(id, image.filename, coleccion);
  }
}
