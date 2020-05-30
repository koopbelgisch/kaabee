import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
import { IsEmail, ValidationError } from "class-validator";
import config from "config";

import { randomURLSafe } from "../helpers/security";
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
  @Column({ type: "varchar", nullable: true })
  public emailToken?: string | null;

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

  public async setEmail(email: string): Promise<Array<ValidationError>> {
    this.email = email;
    this.emailToken = await randomURLSafe(64);
    const validityMs = (config.get("settings.emailTokenValidityMinutes") as number) * 1000 * 60;
    this.emailTokenExpiry = Date.now() + validityMs;
    const errors = await this.validate();
    if (errors.length === 0) {
      await this.save();
    }
    return errors;
  }

  public static async confirmEmail(token?: string): Promise<User | null> {
    if (!token) {
      return null;
    }
    const user = await User.findOne({ emailToken: token });
    if (!user || user.emailTokenExpiry < Date.now()) {
      return null;
    } else {
      user.emailConfirmed = true;
      user.emailToken = null;
      user.emailTokenExpiry = 0;
      return user.save();
    }
  }
}
