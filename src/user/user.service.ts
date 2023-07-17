import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/userDto';
import { PrismaService } from './../prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userDto: UserDto): Promise<User> {
    const data = {
      name: userDto.name,
      email: userDto.email,
      address: userDto.address,
    };
    const createdUser = await this.prisma.user.create({ data });
    return createdUser;
  }
  async getAllUser(): Promise<User[]> {
    const userData = await this.prisma.user.findMany();
    return userData;
  }

  async findUserById(id: string): Promise<User> {
    const userWithId = await this.prisma.user.findUnique({
      where: { id },
    });
    return userWithId;
  }

  async UpdateUserWithId(id: string, data: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser;
  }

  async deleteUserWithId(id: string): Promise<User> {
    const User = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return User;
  }
}
