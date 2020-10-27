import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  /**
   * Адрес, по которому будут отсылаться запросы в хаб ютрека
   */
  @IsNotEmpty()
  @IsString()
  HUB_BASE_URL: string;

  /**
   * Токен, с которым будут отправляться запросы в хаб ютрека
   */
  @IsNotEmpty()
  @IsString()
  HUB_TOKEN: string;

  /**
   * Название СУБД
   */
  @IsNotEmpty()
  @IsString()
  TYPEORM_CONNECTION: string;

  /**
   * Адрес базы
   */
  @IsNotEmpty()
  @IsString()
  TYPEORM_HOST: string;

  /**
   * Имя пользователя в базе
   */
  @IsNotEmpty()
  @IsString()
  TYPEORM_USERNAME: string;

  /**
   * Пароль для базы
   */
  @IsNotEmpty()
  @IsString()
  TYPEORM_PASSWORD: string;

  /**
   * Имя базы данных
   */
  @IsNotEmpty()
  @IsString()
  TYPEORM_DATABASE: string;

  /**
   * Порт базы данных
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  TYPEORM_PORT: number;

  /**
   * Регулярное выражение к entity
   */
  @IsNotEmpty()
  @IsString()
  TYPEORM_ENTITIES: string;

  /**
   * Синхронизация моделей базы
   * @default false
   */
  @IsOptional()
  @IsBoolean()
  @Transform((value) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  TYPEORM_SYNCHRONIZE: boolean = false;

  /**
   * Логирование typeOrm
   * @default false
   */
  @IsOptional()
  @IsBoolean()
  @Transform((value) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  TYPEORM_LOGGING: boolean = false;

  /**
   * Имя аккаунта в гугл
   */
  @IsOptional()
  @IsString()
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;

  /**
   * Пароль аккаунта в гугл
   */
  @IsOptional()
  @IsString()
  GOOGLE_PRIVATE_KEY?: string;

  /**
   * Ключ апи таблиц в гугл
   */
  @IsNotEmpty()
  @IsString()
  GOOGLE_API_KEY: string;

  /**
   * Ключ нужной ексель таблицы в гугл
   */
  @IsNotEmpty()
  @IsString()
  GOOGLE_SHEET_ID: string;
}
