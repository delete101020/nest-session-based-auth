import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../common/schemas';
import { UserRole, UserStatus } from '.';

export const USER_MODEL = 'User';

@Schema()
export class User extends BaseModel {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  phone: string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
