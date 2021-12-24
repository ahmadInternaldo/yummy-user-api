import { Injectable } from '@nestjs/common';
import { successConstant } from 'src/utils/errorConstant';
import { ResponsePrivilegeDto } from './dto/privilege.dto';

@Injectable()
export class PrivilegeService {

  constructor() {}

  async getAllPrivilege(id: string): Promise<ResponsePrivilegeDto> {
    return {
      ...successConstant,
      privileges: [id]
    }
  }
}
