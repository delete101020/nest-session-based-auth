import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ngoc.duong@mailinator.com' })
  email: string;

  @ApiProperty({ example: '87654321' })
  password: string;
}
