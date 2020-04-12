import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Tag } from "./tag"

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

  @ManyToMany(type => Tag, tag => tag.stores)
  @JoinTable()
  public tags: Promise<Tag[]>;

  constructor() {
    super();
  }
}
