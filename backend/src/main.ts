import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://proyecto-redsocial.onrender.com',
      'http://localhost:4200',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const port = parseInt(process.env.PORT || '3000') || 3000;
await app.listen(port, '0.0.0.0', () => {
  console.log(`Backend corriendo en puerto ${port}`);
});


}
bootstrap();

