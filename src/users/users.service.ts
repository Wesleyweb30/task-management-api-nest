import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import {v4 as uuid} from 'uuid';
import {hashSync as bcryptHashSync} from 'bcrypt'
import { prisma } from 'src/prisma/prisma';

@Injectable()
export class UsersService {

    async create(newUser: UserDto){
        newUser.password = bcryptHashSync(newUser.password, 10);
        await prisma.users.create({
            data: {
                username : newUser.username,
                password : newUser.password
            }
        });
        console.log(newUser);
    }

    async findByUserName(username: string): Promise<UserDto | null> {
        const user = await prisma.users.findUnique({
             where: { username: username }, 
            }); 
        return user; 
    }
}
