import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'uuid-123',
  email: 'test@example.com',
  username: 'testuser',
  passwordHash: '',
  role: 'OPERATOR' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  beforeEach(async () => {
    mockUser.passwordHash = await bcrypt.hash('P@ssw0rd!', 10);

    usersService = {
      create: jest.fn(),
      findByEmailRaw: jest.fn(),
      findByIdRaw: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
      decode: jest.fn().mockReturnValue({ iat: 0, exp: 604800 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and return auth response', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'P@ssw0rd!',
      };

      (usersService.create as jest.Mock).mockResolvedValue({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        role: mockUser.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(registerDto);

      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.tokenType).toBe('Bearer');
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      (usersService.findByEmailRaw as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'P@ssw0rd!',
      });

      expect(result.accessToken).toBe('mock.jwt.token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      (usersService.findByEmailRaw as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      (usersService.findByEmailRaw as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'P@ssw0rd!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
