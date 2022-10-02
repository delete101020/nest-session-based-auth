import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from '../../common/decorators';
import { JoiValidationPipe } from '../../common/pipes';
import { User } from '../user/models';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, RegisterDto, ResetPasswordDto } from './dtos';
import { LocalAuthGuard } from './guards';
import {
  ForgotPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from './schemas';

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
    return this._authService.login(user);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new JoiValidationPipe(ForgotPasswordSchema)) data: ForgotPasswordDto,
  ) {
    return this._authService.forgotPassword(data);
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new JoiValidationPipe(ResetPasswordSchema)) data: ResetPasswordDto,
  ) {
    return this._authService.resetPassword(data);
  }
}
