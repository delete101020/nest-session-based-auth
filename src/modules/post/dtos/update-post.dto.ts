import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: '' })
  title?: string;

  @ApiPropertyOptional({ example: '' })
  content?: string;

  @ApiPropertyOptional({ example: '' })
  image?: string;

  @ApiPropertyOptional({ example: '' })
  category?: string;
}
