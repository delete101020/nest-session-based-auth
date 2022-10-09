import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: '' })
  name?: string;

  @ApiPropertyOptional({ example: '' })
  description?: string;

  @ApiPropertyOptional({ example: '' })
  image?: string;
}
