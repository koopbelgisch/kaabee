import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export interface ProviderProfile {
  provider: string;
  id: string;
  displayName: string;
  email: string;
}

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: false })
  public admin!: boolean;

  @Column({ length: 63 })
  public name!: string;

  @Column({ length: 255 })
  public email!: string;

  @Column({ length: 63 })
  public provider!: string;

  @Column({ length: 255 })
  public providerId!: string;

  constructor() {
    super();
  }

  public static async findOrCreate(profile: ProviderProfile): Promise<User> {
    let user = await User.findOne({ provider: profile.provider, providerId: profile.id });
    if (user === undefined) {
      user = new User();
      user.provider = profile.provider;
      user.providerId = profile.id;
      user.name = profile.displayName;
      user.email = profile.email;
      await user.save();
    }
    return user;
  }
}
