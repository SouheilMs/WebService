import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload, Role } from '../common/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user and return a JWT token.
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      password: dto.password,
      role: dto.role,
    });

    this.logger.log(`New user registered: ${user.email}`);
    return this.buildAuthResponse(user.id, user.email, user.username, user.role);
  }

  /**
   * Validate credentials and return a JWT token.
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailRaw(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.email}`);
    return this.buildAuthResponse(user.id, user.email, user.username, user.role as Role);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private buildAuthResponse(
    id: string,
    email: string,
    username: string,
    role: Role,
  ): AuthResponseDto {
    const payload: JwtPayload = { sub: id, email, username, role };
    const accessToken = this.jwtService.sign(payload);

    // Decode to get expiry info
    const decoded = this.jwtService.decode(accessToken) as { exp: number; iat: number };
    const expiresIn = decoded.exp - decoded.iat;

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id,
        email,
        username,
        role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }
}
