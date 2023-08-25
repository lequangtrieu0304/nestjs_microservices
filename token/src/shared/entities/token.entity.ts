import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tokens' })
export class TokenEntity {
  @PrimaryColumn()
  userId: number;

  @Column()
  token: string;
}
