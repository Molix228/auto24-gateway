import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_user')
  async get_user(@Req() req) {
    const userId = req.user.userId;
    const user = await this.authService.get_profile(userId);
    return user;
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
