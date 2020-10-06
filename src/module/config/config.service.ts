import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import * as fs from 'fs';
import { ConfigDto } from './dto/config.dto';
import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as dotenv from 'dotenv';
import { CONFIG_MODULE_PATH } from './constant/config.constant';


@Injectable()
export class ConfigService {
  private readonly _config: ConfigDto;

  constructor(
    @Inject(CONFIG_MODULE_PATH) filePath: string,
  ) {
    const isExistFile = fs.existsSync(filePath);
    let rawConfigFile: any;
    if (isExistFile) {
      rawConfigFile = parse(fs.readFileSync(filePath));
    } else {
      rawConfigFile = process.env;
    }
    this._config = ConfigService._validate(rawConfigFile);
  }

  get config(): ConfigDto {
    return this._config;
  }

  private static _validate(rawConfigFile: dotenv.DotenvParseOutput): ConfigDto {
    const validator = new Validator();
    const transformed = plainToClass(ConfigDto, rawConfigFile);
    const validationErrors = validator.validateSync(transformed);
    if (validationErrors.length) {
      throw validationErrors;
    }
    return transformed;
  }

}