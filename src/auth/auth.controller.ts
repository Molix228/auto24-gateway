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
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { Response } from 'express';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { user, accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_user')
  async get_user(@Req() req) {
    const userId = req.user.userId;
    const user = await this.authService.get_profile(userId);
    return user;
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  async refreshAccessToken(@Req() req) {
    const newAccessToken = await this.authService.refreshAccessToken(
      req.user.userId,
    );
    console.log(newAccessToken);

    return { accessToken: newAccessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Put('update_profile/:id')
  async update_user(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);
    const updatedUser = await this.authService.updateUser(id, updateUserDto);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete_user/:id')
  async delete_user(@Param('id') id: string) {
    const deletedUser = await this.authService.deleteUser(id);
    return deletedUser;
  }
}
