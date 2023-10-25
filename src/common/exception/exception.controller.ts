import {
  BadRequestException,
  Injectable,
  //InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorHandleService {
  private readonly logger = new Logger('ErrorHandleService');

  public errorHandleException(error: any): never {
    if (error.code === '11000') throw new BadRequestException(error.detail);
    this.logger.error(error);
    /*throw new BadRequestException(
      `user exists in db ${JSON.stringify(error.keyValue)}`,
    );*/
    // para fallas globales
    throw new BadRequestException(
      `user exists in db ${JSON.stringify(error.keyValue)}`,
    );
  }
}
