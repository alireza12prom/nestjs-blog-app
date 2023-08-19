import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { SessionRepository, UserRepository } from '../repository';
import { BadRequestException } from '@nestjs/common';
import { ClientTypes } from '../../common/constant';

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

const fakeSession = () => {
  return {
    id: 'e126a7b4-9a37-4d07-a408-34233067558c',
    platform: {
      platform_name: null,
      platform_desc: null,
    },
    ip: '111.111.111',
    createdAt: '2023-08-19T08:23:37.537Z',
  };
};

describe('Auth Service [Unit-Test]', () => {
  let userRepo: UserRepository;
  let sessionRepo: SessionRepository;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(() => {
    userRepo = new UserRepository(jest.fn() as any);
    sessionRepo = new SessionRepository(jest.fn() as any);
    jwtService = new JwtService();
    authService = new AuthService(userRepo, sessionRepo, jwtService);
  });

  it('shoud be defined', () => {
    expect(userRepo).toBeDefined();
    expect(sessionRepo).toBeDefined();
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('register()', () => {
    const body = {
      email: 'email',
      password: 'password',
    };

    it('shoud throw 400 if user has alreay created an account', () => {
      jest.spyOn(userRepo, 'exists').mockResolvedValueOnce(true);

      expect(authService.register(body)).rejects.toThrow(BadRequestException);
    });

    it('shoud register', async () => {
      jest.spyOn(userRepo, 'exists').mockResolvedValueOnce(false);

      jest.spyOn(userRepo, 'create').mockImplementation();

      await expect(authService.register(body)).resolves.toBeUndefined();

      const call = (userRepo.create as jest.Mock).mock.calls[0][0];

      expect(call.email).toEqual(body.email);
      expect(bcrypt.compareSync(body.password, call.password)).toBeTruthy();
    });
  });

  describe('login()', () => {
    const platform = {
      description: 'some description',
    };

    beforeAll(() => {
      jest
        .spyOn(userRepo, 'findByEmail')
        .mockResolvedValueOnce(null)
        .mockImplementation((_, includePass) => {
          return fakeUser(includePass) as any;
        });
    });

    it('shoud throw 400 if user has not created an account yet', () => {
      const body = {
        email: 'email',
        password: 'password',
      };

      expect(authService.login('ip', platform, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud throw 400 if password was not match', () => {
      const body = {
        email: 'email',
        password: 'wrong password',
      };

      expect(authService.login('ip', platform, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud throw 400 if number of open sessions was reached to limit', () => {
      const body = {
        email: 'email',
        password: '12345',
      };

      jest
        .spyOn(sessionRepo, 'countActives')
        .mockResolvedValueOnce(parseInt(process.env.MAX_ACTIVE_SESSION));

      expect(authService.login('ip', platform, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud login', async () => {
      const body = {
        email: 'email',
        password: '12345',
      };

      jest
        .spyOn(sessionRepo, 'countActives')
        .mockResolvedValueOnce(parseInt(process.env.MAX_ACTIVE_SESSION) - 1);

      jest.spyOn(sessionRepo, 'create').mockResolvedValue(fakeSession() as any);

      const jwt = await authService.login('ip', platform, body);

      // verify returned token
      const decodedToken = jwtService.verify(jwt, {
        secret: process.env.JWT_SECRET,
      });
      expect(decodedToken.sessionId).toEqual(fakeSession().id);
      expect(decodedToken.who).toEqual(ClientTypes.USER);
    });
  });
});
