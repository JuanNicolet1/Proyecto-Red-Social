import { Module } from '@nestjs/common';
import { Publicacion } from './schemas/publicaciones.schema';
import { PublicacionSchema } from './schemas/publicaciones.schema';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema }
    ]),
    CloudinaryModule
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService],
})

export class PublicacionesModule {}
