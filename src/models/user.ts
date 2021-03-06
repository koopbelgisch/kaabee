import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
import { IsEmail, IsOptional, ValidationError } from "class-validator";
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
    type: "varchar",
    length: 255,
    nullable: true,
    unique: true,
  })
  @IsEmail()
  @IsOptional()
  public email: string | null;

  @Column({ default: false })
  public emailConfirmed!: boolean;

  @Column({ type: "varchar", nullable: true })
  @IsEmail()
  @IsOptional()
  public emailToConfirm!: string | null;

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

  public async requestEmailChange(email: string): Promise<{updated?: ThisType<User>; errors: Array<ValidationError>}> {
    this.emailToConfirm = email;
    this.emailToken = await randomURLSafe(64);
    const validityMs = (config.get("settings.emailTokenValidityMinutes") as number) * 1000 * 60;
    this.emailTokenExpiry = Date.now() + validityMs;
    return this.saveIfValid();
  }

  public static async confirmEmail(token?: string): Promise<User | null> {
    if (!token) {
      return null;
    }
    const user = await User.findOne({ emailToken: token });
    if (!user || user.emailTokenExpiry < Date.now()) {
      return null;
    } else {
      user.email = user.emailToConfirm;
      user.emailConfirmed = true;
      user.emailToConfirm = null;
      user.emailToken = null;
      user.emailTokenExpiry = 0;
      return user.save();
    }
  }
}
