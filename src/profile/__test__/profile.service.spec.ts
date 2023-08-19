import path from 'path';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository';
import { Filesystem } from '../../common/utils';
import { UploadDirs } from '../../common/constant';
import { ProfileService } from '../profile.service';
import { BadRequestException } from '@nestjs/common';

const fakeUser = (includePassword?: boolean) => {
  const user: Record<string, any> = {
    id: 'e126a7b4-9a37-4d07-a408-34233067558c',
    name: {
      first: 'first name',
      last: 'last name',
      nickname: null,
    },
    avatars: ['filename'],
    bio: null,
    email: 'test@gmail.com',
    createdAt: new Date('2023-08-18T19:25:33.681'),
  };

  if (includePassword) {
    user.password = bcrypt.hashSync('12345', 10);
  }
  return user;
};

describe('Profile Service [Unit-Test]', () => {
  let userRepo: UserRepository;
  let profileService: ProfileService;

  beforeAll(() => {
    userRepo = new UserRepository(jest.fn() as any);
    profileService = new ProfileService(userRepo);
  });

  it('shoud be defined', () => {
    expect(userRepo).toBeDefined();
    expect(profileService).toBeDefined();
  });

  describe('getProfile()', () => {
    it('shoud get profile (without password field)', async () => {
      jest
        .spyOn(userRepo, 'findById')
        .mockImplementationOnce((_, includePassword) => {
          return Promise.resolve(fakeUser(includePassword) as any);
        });

      const result = await profileService.getProfile('id');
      expect(result).toEqual(fakeUser(false));
      expect(result.password).toBeUndefined();
    });
  });

  describe('changePassword()', () => {
    it('shoud throw bad request if old password is not match', () => {
      const body = {
        oldPassword: 'test',
        newPassword: 'test',
      };

      jest
        .spyOn(userRepo, 'findById')
        .mockImplementationOnce((_, includePassword) => {
          return Promise.resolve(fakeUser(includePassword) as any);
        });

      expect(profileService.changePassword('id', body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud chagne password', async () => {
      const body = {
        oldPassword: '12345',
        newPassword: 'test',
      };

      jest
        .spyOn(userRepo, 'findById')
        .mockImplementationOnce((_, includePassword) => {
          return Promise.resolve(fakeUser(includePassword) as any);
        });

      jest.spyOn(userRepo, 'updateOne').mockImplementation();

      await expect(
        profileService.changePassword('id', body),
      ).resolves.toBeUndefined();

      // the hash shoud match with newPassword
      const hashed = (userRepo.updateOne as jest.Mock).mock.calls[0][0].password;
      expect(bcrypt.compareSync(body.newPassword, hashed)).toBeTruthy();
    });
  });

  describe('updateProfile()', () => {
    it('shoud update profile', async () => {
      jest.spyOn(userRepo, 'updateOne').mockImplementationOnce(() => null);

      const body = { fname: 'new name', lname: 'new family' };
      await profileService.updateProfile('id', body);
      expect(userRepo.updateOne).toBeCalledWith({ userId: 'id', ...body });
    });
  });

  describe('uploadAvatar()', () => {
    it('shoud upload avatar', async () => {
      jest.spyOn(userRepo, 'addToAvatar').mockImplementation();

      await profileService.uploadAvatar('id', 'filename');
      expect(userRepo.addToAvatar).toBeCalledWith({
        userId: 'id',
        filename: 'filename',
      });
    });
  });

  describe('deleteAvatar()', () => {
    it("shoud throw error if avatar doesn't exists", async () => {
      jest.spyOn(userRepo, 'findById').mockResolvedValueOnce(fakeUser() as any);

      expect(profileService.deleteAvatar('id', 'wrong filename')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud delete avatar', async () => {
      jest.spyOn(userRepo, 'findById').mockResolvedValueOnce(fakeUser() as any);
      jest.spyOn(Filesystem, 'deleteIfExists').mockImplementation();
      jest.spyOn(userRepo, 'dropFromAvatar').mockImplementation();

      await profileService.deleteAvatar('id', 'filename');

      expect(userRepo.dropFromAvatar).toBeCalledWith({
        userId: 'id',
        filename: 'filename',
      });

      expect(Filesystem.deleteIfExists).toBeCalledWith(
        path.join(process.env.UPLOAD_DIR, UploadDirs.Avatar, 'filename'),
      );
    });
  });

  describe('downloadAvatar()', () => {
    it("shoud throw error if avatar doesn't exists", () => {
      jest.spyOn(Filesystem, 'exists').mockReturnValue(false);

      expect(profileService.downloadAvatar('filename')).rejects.toThrow(
        BadRequestException,
      );

      expect(Filesystem.exists).toBeCalledWith(
        path.join(process.env.UPLOAD_DIR, UploadDirs.Avatar, 'filename'),
      );
    });

    it('shoud return a read stream object', () => {
      jest.spyOn(Filesystem, 'exists').mockReturnValue(true);

      jest
        .spyOn(Filesystem, 'openReadStream')
        .mockReturnValue('ReadStreamObject' as any);

      expect(profileService.downloadAvatar('filename')).resolves.toEqual(
        'ReadStreamObject',
      );
    });
  });
});
