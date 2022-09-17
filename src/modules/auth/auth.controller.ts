import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from '../../common/decorators';
import { JoiValidationPipe } from '../../common/pipes';
import { User } from '../user/models';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { LocalAuthGuard } from './guards';
import { RegisterSchema } from './schemas';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new JoiValidationPipe(RegisterSchema)) data: RegisterDto,
  ) {
    return this._authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    return user;
  }

  @Get('logout')
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) reject(error);
        resolve({});
      });
    });
  }
}
