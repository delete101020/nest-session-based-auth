import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Travel Experience' })
  name: string;

  @ApiPropertyOptional({ example: '' })
  description?: string;

  @ApiPropertyOptional({ example: '' })
  image?: string;
}
