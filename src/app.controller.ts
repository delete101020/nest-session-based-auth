import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequestUser } from './common/decorators';
import { AuthenticatedGuard } from './modules/auth/guards';
import { User } from './modules/user/models';

@Controller()
export class AppController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  getHello(@RequestUser() user: User) {
    return user;
  }
}
