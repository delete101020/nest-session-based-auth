import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/models';
import { compare, genSalt, hash } from 'bcryptjs';
import { ForgotPasswordDto, RegisterDto, ResetPasswordDto } from './dtos';

export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private _userService: UserService,
  ) {}

  async register(data: RegisterDto) {
    const { email, password } = data;

    // Check if user exists
    const checkUser = await this._userService.getOneBy(email, 'email');
    if (checkUser)
      throw new BadRequestException('User with this email already exists');

    // Create new user
    return this._userService.createFromRequestBody({
      ...data,
      password: await this.hashPassword(password),
    });
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;
    const user = await this._userService.getOneBy(email, 'email');
    if (!user) throw new BadRequestException('User not found');

    // TODO: Send email to user
  }

  async resetPassword(data: ResetPasswordDto) {
    const { code, password } = data;

    // TODO: Check if code is valid
    if (code !== '123456') throw new BadRequestException('Invalid code');

    const user = await this._userService.getOneBy(code, 'resetPasswordCode');
    if (!user) throw new BadRequestException('User not found');

    user.password = await this.hashPassword(password);
    await this._userService.update(user);
  }

  /** LOGIN VALIDATION: EMAIL - GOOGLE - FACEBOOK */
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    const user = await this._userService.getOneBy(identifier, 'email');
    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  /** ========== GENERIC METHOD ========== */
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return compare(password, hashPassword);
  }
  /** ========== GENERIC METHOD ========== */
}
