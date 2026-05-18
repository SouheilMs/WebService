import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly bcryptRounds: number;

  constructor(private readonly prisma: PrismaService) {
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  /**
   * Find a user by ID including the password hash (for internal use only).
   */
  async findByIdRaw(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Find a user by email including the password hash (for auth use only).
   */
  async findByEmailRaw(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('A user with this email already exists');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('A user with this username already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash,
        role: dto.role,
      },
    });

    this.logger.log(`User created: ${user.email} (${user.role})`);
    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.toResponseDto(u));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return this.toResponseDto(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.findById(id); // Throws NotFoundException if not found

    if (dto.email) {
      const conflict = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: id } },
      });
      if (conflict) throw new ConflictException('Email already in use');
    }

    if (dto.username) {
      const conflict = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: id } },
      });
      if (conflict) throw new ConflictException('Username already in use');
    }

    const updateData: Partial<{
      email: string;
      username: string;
      passwordHash: string;
      role: 'ADMIN' | 'OPERATOR';
      isActive: boolean;
    }> = {};

    if (dto.email) updateData.email = dto.email;
    if (dto.username) updateData.username = dto.username;
    if (dto.password) updateData.passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
    if (dto.role) updateData.role = dto.role;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id); // Throws NotFoundException if not found
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    this.logger.log(`User soft-deleted: ${id}`);
  }

  // ── Mapper ─────────────────────────────────────────────────────────────────

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as unknown as UserResponseDto['role'],
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
