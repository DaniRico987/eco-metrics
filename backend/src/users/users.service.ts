import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.user.findMany({
      where: { companyId },
    });
  }

  async findPendingByCompany(companyId: string) {
    return this.prisma.user.findMany({
      where: {
        companyId,
        status: UserStatus.PENDING,
      },
    });
  }

  async updateStatus(userId: string, status: UserStatus, currentManager: any) {
    const userToUpdate = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    if (userToUpdate.companyId !== currentManager.companyId) {
      throw new ForbiddenException(
        'You can only manage users within your own company',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }
}
