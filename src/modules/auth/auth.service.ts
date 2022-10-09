import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/models';
import { compare, genSalt, hash } from 'bcryptjs';
import { ForgotPasswordDto, RegisterDto, ResetPasswordDto } from './dtos';
import { ConfigService } from '@nestjs/config';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import { ConfigVar } from '../../configs';

export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

@Injectable()
export class AuthService {
  private readonly jwtOptions: {
    [ACCESS_TOKEN]: SignOptions;
    [REFRESH_TOKEN]: SignOptions;
  };
  private readonly jwtKeys: {
    [ACCESS_TOKEN]: string;
    [REFRESH_TOKEN]: string;
  };

  constructor(
    private readonly _configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private _userService: UserService,
  ) {
    this.jwtKeys = {
      [ACCESS_TOKEN]: this._configService.get<string>(ConfigVar.JWT_SECRET),
      [REFRESH_TOKEN]: this._configService.get<string>(
        ConfigVar.JWT_REFRESH_SECRET,
      ),
    };
    this.jwtOptions = {
      [ACCESS_TOKEN]: {
        expiresIn: this._configService.get<string>(ConfigVar.JWT_EXPIRES_IN),
      },
      [REFRESH_TOKEN]: {
        expiresIn: this._configService.get<string>(
          ConfigVar.JWT_REFRESH_EXPIRES_IN,
        ),
      },
    };
  }

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
    const { email, code, password } = data;

    // TODO: Check if code is valid
    if (code !== '123456') throw new BadRequestException('Invalid code');

    const user = await this._userService.getOneBy(email, 'email');
    if (!user) throw new BadRequestException('User not found');

    user.password = await this.hashPassword(password);
    await this._userService.update(user);
  }

  async login(user: User) {
    const { _id, email, phone, firstName, lastName, status, role } = user;

    const payload = {
      _id,
      email,
      phone,
      firstName,
      lastName,
      status,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signPayload(payload, ACCESS_TOKEN),
      this.signPayload(payload, REFRESH_TOKEN),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const refreshPayload = await this.decodeToken(refreshToken, REFRESH_TOKEN);
    const { _id } = refreshPayload;

    const user = await this._userService.getOneBy(_id);
    if (!user) throw new UnauthorizedException();

    return this.login(user);
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

  /** ========== GENERAL METHOD ========== */
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

  async signPayload(
    payload: any,
    type: string = ACCESS_TOKEN || REFRESH_TOKEN,
  ): Promise<string> {
    return sign(payload, this.jwtKeys[type], this.jwtOptions[type]);
  }

  async decodeToken(
    token: string,
    type: string = ACCESS_TOKEN || REFRESH_TOKEN,
  ): Promise<any> {
    return verify(token, this.jwtKeys[type]);
  }
  /** ========== GENERAL METHOD ========== */
}
