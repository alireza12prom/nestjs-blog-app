import { BaseUserRepository } from '../../common/repository';

interface IUpdateOne {
  userId: string;
  fname?: string;
  lname?: string;
  nickname?: string;
  bio?: string;
  password?: string;
}

interface IAddToAvatar {
  userId: string;
  filename: string;
}

// eslint-disable-next-line
interface IDropFromAvatar extends IAddToAvatar {}

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

  async addToAvatar(input: IAddToAvatar) {
    return await this.user
      .createQueryBuilder()
      .update()
      .set({
        avatars: () => `'{${input.filename}}' || avatars`,
      })
      .where('id = :userId', { userId: input.userId })
      .execute();
  }

  async dropFromAvatar(input: IDropFromAvatar) {
    return await this.user
      .createQueryBuilder()
      .update()
      .set({
        avatars: () => `array_remove(avatars, '${input.filename}')`,
      })
      .where('id = :userId', { userId: input.userId })
      .execute();
  }
}
