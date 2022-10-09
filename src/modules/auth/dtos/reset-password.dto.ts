import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'ngoc.duong@mailinator.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  code: string;

  @ApiProperty({ description: 'new password', example: 'password' })
  password: string;
}
