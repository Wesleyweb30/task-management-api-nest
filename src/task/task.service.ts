import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TaskService {

    async create(task: TaskDto) {
        await prisma.task.create({
            data: {
                title: task.title,
                description: task.description,
                status: task.status,
                expirationDate: new Date(task.expirationDate)
            }
        });
    }

    async findById(id: string): Promise<TaskDto> {
        const foundTask = await prisma.task.findUnique({
            where: { id: id }
        });

        if (!foundTask) {
            throw new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return foundTask;
    }

    async findAll(params: FindAllParameters): Promise<TaskDto[]> {
        const tasks = await prisma.task.findMany({
            where: {
                AND: [
                    params.title ? { title: { contains: params.title } } : {},
                    params.status ? { status: { contains: params.status } } : {}
                ]
            }
        });

        return tasks;
    }

    async update(id: string ,task: TaskDto): Promise<TaskDto> {
        const updatedTask = await prisma.task.update({
            where: { id: id },
            data: {
                title: task.title,
                description: task.description,
                status: task.status,
                expirationDate: new Date(task.expirationDate)
            }
        });

        if (!updatedTask) {
            throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.BAD_REQUEST);
        }

        return updatedTask;
    }

    async remove(id: string): Promise<void> {
        const deletedTask = await prisma.task.delete({
            where: { id: id }
        });

        if (!deletedTask) {
            throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST);
        }
    }
}
