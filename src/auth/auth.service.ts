import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          fullName: dto.fullName, // Ensure firstName is included
          username: dto.username,
          phone: dto.phone,
          photoURL: dto.photoURL,
          role: dto.role,
          status: dto.status,
          createdBy: dto.createdBy,
        },
      });
      delete user.password; // Make sure password is not returned in the response

      return this.signToken(user.id, user.email, user);
    } catch (error) {
      this.logger.error(
        `Error occurred during sign-up: ${error.message}`,
        error.stack,
      );

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw new InternalServerErrorException('Error occurred during sign-up');
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials Is Incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials Is Incorrect');
    return this.signToken(user.id, user.email, user);
  }

  signToken(
    userId: number,
    email: string,
    user: User = null,
  ): Promise<{ access_token: string; userEmail: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const userEmail = email;
    return this.jwt
      .signAsync(payload, {
        expiresIn: '60m',
        secret: secret,
      })
      .then((token) => {
        return {
          access_token: token,
          userEmail,
          user,
        };
      });
  }
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          role: true,
          createdBy: true,
          photoURL: true,
          status: true,
          phone: true,
        },
      });
      return users;
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching all users: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error occurred while fetching users',
      );
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          fullName: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          role: true,
          createdBy: true,
          photoURL: true,
          status: true,
          phone: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error occurred while fetching user by ID: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error occurred while fetching user',
      );
    }
  }
}
