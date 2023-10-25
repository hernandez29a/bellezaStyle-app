import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest().body.rol;

    if (req === 'USER_ROLE' || req === 'ESPEC_ROLE') {
      return true;
    }
    throw new ForbiddenException(`dont have acces,  need a valid role`);
  }
}
