import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import {compareSync as bcryptCompareSync} from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/users/user.dto';

@Injectable()
export class AuthService {

    private jwtExpirationTimeInSeconds: number;

    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){
        this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
    }

    async signIn(username: string, password: string): Promise<AuthResponseDto>{
        const foundUser = await this.usersService.findByUserName(username);

        if(!foundUser || !bcryptCompareSync(password, foundUser.password)){
            throw new UnauthorizedException();
        }

        const payload = { sub: foundUser.id, username : foundUser.username};

        const token = this.jwtService.sign(payload);

        return { token, expiresIn: this.jwtExpirationTimeInSeconds}

    }

    async register(user: UserDto): Promise<UserDto>{
       const newUser: UserDto = await this.usersService.create(user);
       return newUser;
    }
}
