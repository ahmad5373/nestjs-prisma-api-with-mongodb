import { User } from '@prisma/client';
import { UserDto } from 'src/dto/userDto';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(@Res() res: Response): Promise<User[]> {
    try {
      const UserData = await this.userService.getAllUser();
      res.status(HttpStatus.OK).json({Data:UserData});
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
    return;
  }

  @Get(':id')
  async findUserWithId(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<User> {
    try {
      const userWithId = await this.userService.findUserById(id);
      if (!userWithId) {
        throw new NotFoundException('User Not Found');
      }
      res.status(HttpStatus.OK).json(userWithId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Invalid User ID',
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: error.message,
        });
      }
    }
    return;
  }

  @Post('CreateUser')
  async createUser(@Body() userDto: UserDto, @Res() res: Response) {
    try {
      const user = await this.userService.createUser(userDto);
      res
        .status(HttpStatus.CREATED)
        .json({ message: 'User Created Successfully!', Data: user });
    } catch (error) {
      res.status(400).json({ error: 'Error', Message: error.message });
    }
  }

  @Patch(':id')
  async updateUserWithId(
    @Param('id') id: string,
    @Body() userDto: UserDto,
    @Res() res: Response,
  ) {
    try {
      const updateduser = await this.userService.UpdateUserWithId(id, userDto);
      res
        .status(HttpStatus.OK)
        .json({ Message: 'Update User successfully', Data: updateduser });
    } catch (error) {
      error instanceof NotFoundException;
      res.status(HttpStatus.NOT_FOUND).json({
        error: 'User not found',
      });
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.userService.deleteUserWithId(id);
      res.status(HttpStatus.OK).json({
        message: `User Data is deleted successfully with Id ${id}`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(`cannot find user with this id: ${id}`);
    }
  }
}
