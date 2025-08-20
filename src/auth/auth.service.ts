import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}
  async onModuleInit() {
    // Subscribe to the topics this service will consume
    this.authClient.subscribeToResponseOf('user.exists');
    this.authClient.subscribeToResponseOf('user.register');
    this.authClient.subscribeToResponseOf('user.login');
    this.authClient.subscribeToResponseOf('auth.validate-token');
    this.authClient.subscribeToResponseOf('user.get-profile');
    this.authClient.subscribeToResponseOf('user.deletebyid');
    this.authClient.subscribeToResponseOf('user.update-profile');
    await this.authClient.connect();
  }

  // api-gateway/auth/auth.service.ts
  async register(createUserDto: CreateUserDto) {
    try {
      const isUserExist = await lastValueFrom(
        this.authClient.send('user.exists', createUserDto.email),
      );

      if (isUserExist) {
        throw new ConflictException('User already exists');
      }

      const registerPayload = plainToInstance(Object, createUserDto);

      const registeredUser = await lastValueFrom(
        this.authClient.send('user.register', registerPayload),
      );
      console.log('[API_GW] User registered successfully');
      return registeredUser;
    } catch (error) {
      console.error('[API_GW] Error while registration:', error);
      throw new ConflictException('Registration failed', error.message);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const loginPayload = plainToInstance(Object, loginUserDto);
    return await lastValueFrom(
      this.authClient.send('user.login', loginPayload),
    );
  }

  async get_profile(id: string) {
    const user = await lastValueFrom(
      this.authClient.send('user.get-profile', id),
    );
    if (!user) throw new InternalServerErrorException('User not found');
    return user;
  }

  async deleteUser(id: string) {
    const user = await firstValueFrom(
      this.authClient.send('user.deletebyid', id),
    );
    if (!user) throw new NotFoundException(`User with ID: ${id} not found`);
    console.debug('User was Successfully DELETED from DB!');
    return user;
  }

  async validateToken(token: string) {
    const result = await firstValueFrom(
      this.authClient.send('auth.validate-token', token),
    );
    if (!result) throw new InternalServerErrorException(`Token is not valid`);
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateUserPayload = plainToInstance(Object, updateUserDto);
      const payload = {
        id: id,
        ...updateUserPayload,
      };
      const updatedUser = await lastValueFrom(
        this.authClient.send('user.update-profile', payload),
      );
      return updatedUser;
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong',
        err.message,
      );
    }
  }
}
