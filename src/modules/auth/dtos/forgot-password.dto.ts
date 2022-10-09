import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'ngoc.duong@mailinator.com' })
  email: string;
}
