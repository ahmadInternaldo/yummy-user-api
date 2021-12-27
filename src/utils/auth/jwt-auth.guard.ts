import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  unauthorizedErrorConstant,
} from '../../utils/constants/error.constants';
import { IS_PUBLIC_KEY } from '../../utils/decorators/public.decorator';
import { FilterException } from '../../utils/exceptions/filter-exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }else {
        const data = await super.canActivate(context)
        return super.canActivate(context);
      }
      
    } catch (error) {
      throw new FilterException(error)
    }
  }

  handleRequest(err: any, user: any) {
    try {
      if (err || !user) {
        throw err || new UnauthorizedException(unauthorizedErrorConstant);
      }

      return user;
    } catch (error) {
      throw new FilterException(error);
    }
  }
}
