import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [PublicacionesModule, AutenticacionModule, DatabaseModule, CloudinaryModule, ConfigModule.forRoot({ // <--- Agrega esto
      isGlobal: true, // Hace que las variables estén disponibles globalmente
    }), ComentariosModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
