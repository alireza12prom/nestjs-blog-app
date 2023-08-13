import { BaseUserRepository } from '../../common/repository';

interface IUpdateOne {
  userId: string;
  fname?: string;
  lname?: string;
  nickname?: string;
  bio?: string;
  password?: string;
}

export class UserRepository extends BaseUserRepository {
  async updateOne(input: IUpdateOne) {
    return await this.user
      .createQueryBuilder()
      .update()
      .set({
        name: {
          fname: input.fname || undefined,
          lname: input.lname || undefined,
          nickname: input.nickname || undefined,
        },
        bio: input.bio || undefined,
        password: input.password || undefined,
      })
      .where('id = :userId', { userId: input.userId })
      .execute();
  }

  async getOne(userId: string) {
    return this.user.findOneBy({ id: userId });
  }
}
