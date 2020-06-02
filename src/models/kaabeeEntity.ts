import { BaseEntity } from "typeorm";
import { validate, ValidatorOptions, ValidationError } from "class-validator";

export abstract class KaabeeEntity extends BaseEntity {

  public async validate(opts?: ValidatorOptions): Promise<Array<ValidationError>> {
    return validate(this, opts);
  }

  public async saveIfValid<T extends KaabeeEntity>():
    Promise<{ updated?: ThisType<T>; errors: Array<ValidationError> }>
  {

    const errors = await this.validate();
    let updated;
    if(errors.length === 0) {
      updated = await this.save();
    }
    return { updated, errors };
  }

}
