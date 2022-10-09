import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ngoc.duong@mailinator.com' })
  email: string;

  @ApiProperty({ example: '12345678' })
  password: string;

  @ApiPropertyOptional({ example: 'Ngoc' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Duong' })
  lastName?: string;
}
