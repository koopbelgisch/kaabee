import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
import { IsEmail } from "class-validator";

import { KaabeeEntity } from "./kaabeeEntity";

type Provider = "facebook" | "google";

export interface ProviderProfile {
  id: string;
  displayName: string;
  email?: string;
}

@Entity()
export class User extends KaabeeEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: false })
  public admin!: boolean;

  @Index()
  @Column({ length: 63 })
  public name!: string;

  @Index()
  @Column({
    length: 255,
    nullable: true,
    unique: true,
  })
  @IsEmail()
  public email!: string;

  @Column({ default: false })
  public emailConfirmed!: boolean;

  @Index()
  @Column({ nullable: true })
  public emailToken?: string;

  @Column({ default: 0 })
  public emailTokenExpiry!: number;

  @Column({ length: 63 })
  public provider!: string;

  @Column({ length: 255 })
  public providerId!: string;

  constructor() {
    super();
  }

  public static async findOrCreate(provider: Provider, profile: ProviderProfile): Promise<User> {
    let user = await User.findOne({ provider: provider, providerId: profile.id });
    if (user === undefined) {
      user = new User();
      user.provider = provider;
      user.providerId = profile.id;
      user.name = profile.displayName;
      if(profile.email) {
        user.email = profile.email;
      }
      await user.save();
    }
    return user;
  }

  public hasConfirmedEmail(): boolean {
    return this.email !== undefined && this.emailConfirmed;
  }
}
