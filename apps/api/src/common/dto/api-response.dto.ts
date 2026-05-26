import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseMetaDto {
  @ApiPropertyOptional({ example: '018f7b88-9b56-78b5-a7ef-63f2db7f7c12' })
  correlationId?: string;

  @ApiPropertyOptional({ example: 12 })
  durationMs?: number;
}

export class ApiSuccessResponseDto<TData> {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty()
  data!: TData;

  @ApiPropertyOptional({ type: ApiResponseMetaDto })
  meta?: ApiResponseMetaDto;

  @ApiProperty({ example: '2026-05-16T00:00:00.000Z' })
  timestamp!: string;
}

export class ApiErrorPayloadDto {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code!: string;

  @ApiProperty({ example: 'Validation failed.' })
  message!: string;

  @ApiPropertyOptional()
  details?: unknown;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ type: ApiErrorPayloadDto })
  error!: ApiErrorPayloadDto;

  @ApiPropertyOptional({ type: ApiResponseMetaDto })
  meta?: ApiResponseMetaDto;

  @ApiProperty({ example: '2026-05-16T00:00:00.000Z' })
  timestamp!: string;
}
