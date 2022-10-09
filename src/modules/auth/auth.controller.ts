import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { BaseController } from '../../common/controllers';
import { RequestUser } from '../../common/decorators';
import { JoiValidationPipe } from '../../common/pipes';
import { User } from '../user/models';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dtos';
import { LocalAuthGuard } from './guards';
import {
  ForgotPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from './schemas';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private _authService: AuthService) {
    super();
  }

  @Post('register')
  async register(
    @Body(new JoiValidationPipe(RegisterSchema)) data: RegisterDto,
  ) {
    return this._authService.register(data);
  }

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    return this._authService.login(user);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this._authService.refreshToken(refreshToken);
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
