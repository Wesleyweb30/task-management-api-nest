import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FindAllParameters, TaskDto } from './task.dto';

const prisma = new PrismaClient();

@Injectable()
export class TaskService {
  async create(task: TaskDto, userId: string) {
    return await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        expirationDate: new Date(task.expirationDate),
        userId, // Adiciona o userId diretamente
      },
    });
  }

  async findById(id: string, userId: string): Promise<TaskDto> {
    const foundTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!foundTask || foundTask.userId !== userId) {
      throw new HttpException('Task not found or access denied', HttpStatus.FORBIDDEN);
    }

    return foundTask;
  }

  async findAll(params: FindAllParameters, userId: string): Promise<TaskDto[]> {
    return await prisma.task.findMany({
      where: {
        userId, // Filtra apenas tarefas do usuário
        AND: [
          params.title ? { title: { contains: params.title } } : {},
          params.status ? { status: { contains: params.status } } : {},
        ],
      },
    });
  }

  async update(id: string, task: TaskDto, userId: string): Promise<TaskDto> {
    const existingTask = await this.findById(id, userId);

    if (!existingTask) {
      throw new HttpException('Task not found or access denied', HttpStatus.FORBIDDEN);
    }

    return await prisma.task.update({
      where: { id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        expirationDate: new Date(task.expirationDate),
      },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const existingTask = await this.findById(id, userId);

    if (!existingTask) {
      throw new HttpException('Task not found or access denied', HttpStatus.FORBIDDEN);
    }

    await prisma.task.delete({
      where: { id },
    });
  }
}
