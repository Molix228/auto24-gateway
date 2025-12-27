import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/dto/requests/create-user.dto';
import { LoginUserDto } from 'src/dto/requests/login-user.dto';
import { LoginUserResponse, RegisteredUserResponse } from '../dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}
  async onModuleInit() {
    // Subscribe to the topics this service will consume
    this.authClient.subscribeToResponseOf('user.exists');
    this.authClient.subscribeToResponseOf('auth.register');
    this.authClient.subscribeToResponseOf('auth.login');
    this.authClient.subscribeToResponseOf('auth.validate-token');
    this.authClient.subscribeToResponseOf('auth.validate-refresh-token');
    this.authClient.subscribeToResponseOf('auth.refresh-access-token');

    await this.authClient.connect();
  }

  // api-gateway/auth/auth.service.ts
  async register(
    createUserDto: CreateUserDto,
  ): Promise<RegisteredUserResponse> {
    try {
      const isUserExist = await lastValueFrom(
        this.authClient.send('user.exists', createUserDto.email),
      );

      if (isUserExist) {
        throw new ConflictException('User already exists');
      }

      const registerPayload = plainToInstance(Object, createUserDto);

      const registeredUser = await lastValueFrom(
        this.authClient.send('auth.register', registerPayload),
      );
      return registeredUser;
    } catch (error) {
      console.error('[API_GW] Error while registration:', error);
      throw new ConflictException('Registration failed', error.message);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponse> {
    const loginPayload = plainToInstance(Object, loginUserDto);
    const response = await lastValueFrom(
      this.authClient.send('auth.login', loginPayload),
    );
    return response;
  }

  async validateToken(token: string) {
    const result = await firstValueFrom(
      this.authClient.send('auth.validate-token', token),
    );
    if (!result) throw new InternalServerErrorException(`Token is not valid`);
    return result;
  }

  async refreshAccessToken(id: string): Promise<string> {
    const result = await firstValueFrom(
      this.authClient.send('auth.refresh-access-token', id),
    );
    if (!result)
      throw new InternalServerErrorException(`Refresh token is not valid`);
    return result;
  }

  async validateRefreshToken(token: string) {
    const result = await firstValueFrom(
      this.authClient.send('auth.validate-refresh-token', token),
    );
    if (!result)
      throw new InternalServerErrorException(`RefreshToken is not valid`);
    return result;
  }
}
