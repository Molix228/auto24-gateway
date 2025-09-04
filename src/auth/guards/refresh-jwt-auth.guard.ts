import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

export class RefreshJwtGuard implements CanActivate {
  constructor(@Inject() private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { refreshToken } = req.cookies;
    console.log(refreshToken);

    if (!refreshToken) throw new UnauthorizedException('Missing token');

    const result = await this.authService.validateRefreshToken(refreshToken);
    if (!result.valid) throw new UnauthorizedException('Token is not valid');

    req.user = { userId: result.userId, username: result.username };
    return true;
  }
}
