import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUserResponseDto, UpdateUserDto } from 'src/dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // INFO: - GET USER PROFILE ENDPOINT
  @UseGuards(JwtAuthGuard)
  @Get('get_user')
  async get_user(@Req() req): Promise<GetUserResponseDto> {
    const userId = req.user.userId;
    const user = await this.userService.get_profile(userId);
    return user;
  }

  // INFO: - LOGOUT ENDPOINT
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }

  // INFO: - UPDATE USER PROFILE ENDPOINT
  @UseGuards(JwtAuthGuard)
  @Put('update_profile/:id')
  async update_user(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return updatedUser;
  }

  // INFO: - DELETE USER ENDPOINT
  @UseGuards(JwtAuthGuard)
  @Delete('delete_user')
  async delete_user(@Req() req) {
    const deletedUser = await this.userService.deleteUser(req.user.userId);
    return deletedUser;
  }
}
