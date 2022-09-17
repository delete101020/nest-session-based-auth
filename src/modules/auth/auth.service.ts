import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/models';
import { compare, genSalt, hash } from 'bcryptjs';
import { RegisterDto } from './dtos';

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
