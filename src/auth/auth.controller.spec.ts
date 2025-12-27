import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  GetUserResponseDto,
  LoggedUserDto,
  LoginUserDto,
  RegisteredUserDto,
} from '../dto';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            get_profile: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockResponse: RegisteredUserDto = {
        id: 'mock-uuid',
        username: 'testuser',
        email: 'testemail@example.com',
      };

      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValue(mockResponse);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testemail@example.com',
        password: 'TestPassword123',
      };

      const result = await authController.register(createUserDto);

      expect(result).toEqual(mockResponse);
      expect(registerSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login a user + set refreshToken cookie', async () => {
      const mockResponse: LoggedUserDto = {
        user: {
          id: 'mock-uuid',
          username: 'testuser',
        },
        accessToken: 'mock-access',
        refreshToken: 'mock-refresh',
      };

      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockResolvedValue(mockResponse);

      const cookieMock = jest.fn();

      const res = {
        cookie: cookieMock,
      } as unknown as Response;

      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'TestPassword123',
      };

      const result = await authController.login(loginUserDto, res);

      expect(result).toEqual({
        user: mockResponse.user,
        accessToken: mockResponse.accessToken,
        refreshToken: mockResponse.refreshToken,
      });

      expect(cookieMock).toHaveBeenCalledWith(
        'refreshToken',
        mockResponse.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        }),
      );

      expect(loginSpy).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('get_user', () => {
    it('should get user profile', async () => {
      const mockResponse: GetUserResponseDto = {
        id: 'mock-uuid',
        username: 'testuser',
        email: 'testemail@example.com',
        createdAt: new Date('mock-date'),
        updatedAt: new Date('mock-date'),
      };

      const getProfileSpy = jest
        .spyOn(authService, 'get_profile')
        .mockResolvedValue(mockResponse);

      const req = {
        user: {
          userId: 'mock-uuid',
          username: 'testuser',
        },
      };

      const result = await authController.get_user(req);

      expect(result).toEqual(mockResponse);
      expect(getProfileSpy).toHaveBeenCalledWith(req.user.userId);
    });
  });
});
