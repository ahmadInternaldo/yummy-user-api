import { Controller, Get, Req } from '@nestjs/common';
import { ResponsePrivilegeDto } from './dto/privilege.dto';
import { PrivilegeService } from './privilege.service';

@Controller('privilege')
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @Get()
  async getAllPrivilege(@Req() req): Promise<ResponsePrivilegeDto> {
    //nanti akan dihapus
    req['user'] = {id: 'testing'}
    return this.privilegeService.getAllPrivilege(req.user.id)
  }
}
