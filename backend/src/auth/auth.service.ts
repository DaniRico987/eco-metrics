import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    companyId: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyId: data.companyId,
        role: Role.USER,
        status: UserStatus.PENDING,
      },
    });

    return this.signToken(user);
  }

  async registerCompany(data: {
    company: { name: string; sector: string; employeesCount: number };
    admin: { name: string; email: string; password: string };
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.admin.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.admin.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: data.company,
      });

      const user = await tx.user.create({
        data: {
          name: data.admin.name,
          email: data.admin.email,
          password: hashedPassword,
          companyId: company.id,
          role: Role.COMPANY_MANAGER,
          status: UserStatus.ACTIVE,
        },
      });

      return this.signToken(user);
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.REJECTED) {
      throw new ForbiddenException('Your access request has been rejected');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  private signToken(user: {
    id: string;
    email: string;
    role: string;
    companyId: string;
    status: UserStatus;
  }) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        status: user.status,
      },
    };
  }
}
