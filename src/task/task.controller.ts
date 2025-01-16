import { TaskService } from './task.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService){}

    @Post()
    create(@Body() task: TaskDto, @Req() req: Request) {
      return this.taskService.create(task, req['user'].sub); // Passa o userId
    }
  
    @Get('/:id')
    async findById(@Param('id') id: string, @Req() req: Request): Promise<TaskDto> {
      return await this.taskService.findById(id, req['user'].sub); // Passa o userId
    }
  
    @Get()
    async findAll(@Query() params: FindAllParameters, @Req() req: Request): Promise<TaskDto[]> {
      return await this.taskService.findAll(params, req['user'].sub); // Filtra pelo userId
    }
  
    @Put('/:id')
    async update(@Param('id') id: string, @Body() task: TaskDto, @Req() req: Request): Promise<TaskDto> {
      return await this.taskService.update(id, task, req['user'].sub); // Valida o userId
    }
  
    @Delete('/:id')
    remove(@Param('id') id: string, @Req() req: Request) {
      return this.taskService.remove(id, req['user'].sub); // Valida o userId
    }
}
