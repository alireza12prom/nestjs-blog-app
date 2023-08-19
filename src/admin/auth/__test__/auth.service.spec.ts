import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { AdminRepository, SessionRepository } from '../repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientTypes } from '../../../common/constant';

const fakeAdmin = () => {
  return {
    id: 'e126a7b4-9a37-4d07-a408-34233067558c',
    name: {
      fname: 'first name',
      lname: 'last name',
    },
    username: 'admin',
    password: '$2b$10$WqXHc2quy.fOtR1KJgDpsuuP.yCYWPVxhw9RJxZfwPOQFg/a0PiOi', // 12345
    createdAt: '2023-08-19T08:23:37.537Z',
  };
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

describe('Admin/Auth Service [Unit-Test]', () => {
  let authService: AuthService;
  let adminRepo: AdminRepository;
  let sessionRepo: SessionRepository;
  let jwtService: JwtService;

  beforeAll(() => {
    adminRepo = new AdminRepository(jest.fn() as any);
    sessionRepo = new SessionRepository(jest.fn() as any);
    jwtService = new JwtService();
    authService = new AuthService(adminRepo, sessionRepo, jwtService);
  });

  it('shoud be defined', () => {
    expect(authService).toBeDefined();
    expect(adminRepo).toBeDefined();
    expect(sessionRepo).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login()', () => {
    const platform = {
      description: 'some description',
    };

    beforeAll(() => {
      jest
        .spyOn(adminRepo, 'findByUsername')
        .mockResolvedValueOnce(null)
        .mockImplementation(() => fakeAdmin() as any);
    });

    it('shoud throw 404 if account is not found', () => {
      const body = {
        username: 'username',
        password: 'password',
      };

      expect(authService.login('ip', platform, body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('shoud throw 400 if password was not match', () => {
      const body = {
        username: 'username',
        password: 'wrong password',
      };

      expect(authService.login('ip', platform, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud throw 400 if number of active sessions has reached to limit', () => {
      const body = {
        username: 'username',
        password: '12345',
      };

      jest
        .spyOn(sessionRepo, 'countActives')
        .mockResolvedValueOnce(parseInt(process.env.MAX_ADMIN_ACTIVE_SESSION));

      expect(authService.login('ip', platform, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('shoud login', async () => {
      const body = {
        username: 'username',
        password: '12345',
      };

      jest
        .spyOn(sessionRepo, 'countActives')
        .mockResolvedValueOnce(parseInt(process.env.MAX_ADMIN_ACTIVE_SESSION) - 1);

      jest.spyOn(sessionRepo, 'create').mockResolvedValueOnce(fakeSession() as any);

      const jwt = await authService.login('ip', platform, body);

      // verify returned token
      const decodedToken = jwtService.verify(jwt, {
        secret: process.env.JWT_SECRET,
      });
      expect(decodedToken.sessionId).toEqual(fakeSession().id);
      expect(decodedToken.who).toEqual(ClientTypes.ADMIN);
    });
  });
});
