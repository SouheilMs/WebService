import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const mockPrismaUser = {
  id: 'uuid-123',
  email: 'test@example.com',
  username: 'testuser',
  passwordHash: 'hashed',
  role: 'OPERATOR' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: jest.Mocked<Partial<PrismaService>>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user!.create as jest.Mock).mockResolvedValue(mockPrismaUser);

      const result = await service.create({
        email: 'test@example.com',
        username: 'testuser',
        password: 'P@ssw0rd!',
      });

      expect(result.email).toBe('test@example.com');
      expect((result as any).passwordHash).toBeUndefined();
    });

    it('should throw ConflictException for duplicate email', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue(mockPrismaUser);

      await expect(
        service.create({ email: 'test@example.com', username: 'other', password: 'P@ssw0rd!' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue(mockPrismaUser);

      const result = await service.findById('uuid-123');
      expect(result.id).toBe('uuid-123');
    });

    it('should throw NotFoundException for missing user', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findById('uuid-999')).rejects.toThrow(NotFoundException);
    });
  });
});
