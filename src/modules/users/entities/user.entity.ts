import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: number | null;

  @Column({ default: false })
  has2FA: boolean;

  @Column({ nullable: true })
  smsCode: string;

  @Column({ nullable: true })
  resetToken: string;

  @CreateDateColumn()
  createdAt: Date;
}
