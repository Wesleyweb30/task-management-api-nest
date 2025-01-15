import { TaskService } from './task.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService){}

    @Post()
    create(@Body() task: TaskDto){
        this.taskService.create(task);
    }

    @Get('/:id')
    async findById(@Param('id') id: string): Promise<TaskDto>{
        return await this.taskService.findById(id);
    }

    @Get()
    async findAll(@Query() params: FindAllParameters):  Promise<TaskDto[]>{
        return await this.taskService.findAll(params);
    }

    @Put('/:id')
    async update(@Param('id') id: string , @Body() task: TaskDto): Promise<TaskDto>{
        return await this.taskService.update(id, task);
    }

    @Delete('/:id')
    remove(@Param('id') id: string){
        return this.taskService.remove(id);
    }
}
