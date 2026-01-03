import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import {
  CreateUserDto,
  LoginUserDto,
  LoginUserResponse,
  RegisteredUserResponse,
} from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // INFO: - REGISTER ENDPOINT
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisteredUserResponse> {
    return await this.authService.register(createUserDto);
  }

  // INFO: - LOGIN ENDPOINT
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponse> {
    try {
      const { user, accessToken, refreshToken } =
        await this.authService.login(loginUserDto);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
      });

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // INFO: - REFRESH ACCESS TOKEN ENDPOINT
  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  async refreshAccessToken(@Req() req) {
    const newAccessToken = await this.authService.refreshAccessToken(
      req.user.userId,
    );

    return { accessToken: newAccessToken };
  }

  // INFO: - LOGOUT ENDPOINT
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }
}
