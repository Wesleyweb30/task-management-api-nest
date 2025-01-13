import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; // Certifique-se de importar o tipo correto

@Injectable()
export class AuthGuard implements CanActivate {

  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService, 
    private readonly configService: ConfigService
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      // Armazena o payload do token no objeto `request`
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Usa a notação de índice para acessar o cabeçalho
    const authorizationHeader = request.headers['authorization'];

    // Valida o cabeçalho e divide o valor em "Bearer" e o token
    if (!authorizationHeader || typeof authorizationHeader !== 'string') {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
