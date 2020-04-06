import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Store extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 63 })
  public name!: string;

  @Column({ length: 15 })
  public vatnumber!: string;

  @Column({ length: 1023 })
  public description!: string;

  @Column({ length: 8 })
  public postcode!: string;

  constructor() {
    super();
  }
}
