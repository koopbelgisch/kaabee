import { BaseEntity } from "typeorm";
import { validate, ValidatorOptions, ValidationError } from "class-validator";

export abstract class KaabeeEntity extends BaseEntity {

  public async validate(opts?: ValidatorOptions): Promise<Array<ValidationError>> {
    return validate(this, opts);
  }

}
