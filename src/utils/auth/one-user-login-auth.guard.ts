import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from '../../entities/userProfile';
import {
  kickOutAccount,
  sessionTokenExpiredErrorConstant,
} from '../../utils/constants/error.constants';
import { FilterException } from '../../utils/exceptions/filter-exception';

@Injectable()
export class OneUserLoginGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,

    @InjectModel(UserProfile)
    private readonly userRepo: typeof UserProfile,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const headers = context.switchToHttp().getRequest().headers;
      const checkKickOutAccount = await this.userRepo.findOne({
        where: {
          jwtToken: headers.authorization.replace(/Bearer /g, ''),
        },
      });
      const loginData = await this.jwtService.verifyAsync(
        headers.authorization.replace(/Bearer /g, ''),
        {
          secret: process.env.SECRET_KEY,
        },
      );

      if (loginData.exp < Math.floor(new Date().getTime() / 1000)) {
        throw new ForbiddenException(sessionTokenExpiredErrorConstant);
      } else if (!checkKickOutAccount) {
        throw new ForbiddenException(kickOutAccount);
      } else {
        return true;
      }
    } catch (err) {
      throw new FilterException(err);
    }
  }
}
