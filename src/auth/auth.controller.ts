import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { UserDto } from 'src/users/user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body('username') username: string, @Body('password') password: string): Promise<AuthResponseDto> {
        return await this.authService.signIn(username, password);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body('username') username: string, @Body('password') password:string): Promise<UserDto> {
        const newUserRequest : UserDto = { username, password};
        return await this.authService.register(newUserRequest);
    }
}
