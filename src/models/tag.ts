import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Store } from "./store";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ length: 63 })
  public name!: string;

  @ManyToMany(type => Store, store => store.tags)
  public stores: Promise<Store[]>;

  constructor() {
    super();
  }
}