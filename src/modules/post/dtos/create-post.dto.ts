import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Travel Experience' })
  title: string;

  @ApiPropertyOptional({ example: '' })
  content?: string;

  @ApiPropertyOptional({ example: '' })
  image?: string;

  @ApiPropertyOptional({ example: '' })
  category?: string;
}
