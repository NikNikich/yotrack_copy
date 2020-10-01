import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfigDto {
  /**
   * Окружение, в котором запускается
   */
  @IsOptional()
  @IsString()
  NODE_ENV = 'development';

  /**
   * Адрес, по которому будут отсылаться запросы в ютрек
   */
  @IsNotEmpty()
  @IsString()
  YOUTRACK_BASE_URL: string;

  /**
   * Токен, с которым будут отправляться запросы в ютрек
   */
  @IsNotEmpty()
  @IsString()
  YOUTRACK_TOKEN: string;
}