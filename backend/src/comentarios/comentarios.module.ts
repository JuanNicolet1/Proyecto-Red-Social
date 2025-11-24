import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Comentarios, ComentariosSchema } from './schemas/comentarios.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentarios.name, schema: ComentariosSchema },
    ]),
  ],
  providers: [ComentariosService],
  controllers: [ComentariosController],
})
export class ComentariosModule {}
