import { Module } from '@nestjs/common';
import { ErrorHandleService } from './exception/exception.controller';

@Module({
  providers: [ErrorHandleService],
  exports: [ErrorHandleService],
})
export class CommonModule {}
