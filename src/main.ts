import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://task-management-app-angular.onrender.com/', // URL da aplicação Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Caso você use cookies
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
