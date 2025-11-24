import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CrearComentariosDto } from './dto/crear-comentario.dto';
import { ComentariosService } from './comentarios.service';

@Controller('comentarios')
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService){}

   @Get('comentarios-por-dia')
  async comentariosPorDia(
    @Query('desde') desdeStr: string,
    @Query('hasta') hastaStr: string,
  ) {
    const desde = new Date(desdeStr);
    const hasta = new Date(hastaStr);
    return await this.comentariosService.comentariosTotalesPorDia(desde, hasta);
  }

  // GET /estadisticas/comentarios-por-publicacion?desde=...&hasta=...&limit=10
  @Get('comentarios-por-publicacion')
  async comentariosPorPublicacion(
    @Query('desde') desdeStr: string,
    @Query('hasta') hastaStr: string,
    @Query('limit') limit = '10',
  ) {
    const desde = new Date(desdeStr);
    const hasta = new Date(hastaStr);
    return await this.comentariosService.comentariosPorPublicacion(desde, hasta, Number(limit));
  }

    
    @Post(':pubId')
        async publicacion(@Body() crearPublicacionDto: CrearComentariosDto, 
        @Param('pubId') pubId: string,) {  
            try {
                const comentario = await this.comentariosService.crear(crearPublicacionDto, pubId)
                return comentario;
            }
            catch (error) {
                console.error('Error al publicar:', error);
                throw error;
            }
        }

    @Put(':pubId/:comId')
        async editar(@Body() crearPublicacionDto: CrearComentariosDto, 
        @Param('pubId') pubId: string, @Param('comId') comId: string) {  
            try {
                const comentario = await this.comentariosService.editar(comId, crearPublicacionDto, pubId)
                return comentario;
            }
            catch (error) {
                console.error('Error al publicar:', error);
                throw error;
            }
        }

    @Get()
        async comentario(@Query('limit') limit = 10) {
        const publicaciones = await this.comentariosService.mostrarComentarios(Number(limit));
        return publicaciones;
        }

    @Get('comentario/:pubId')
        async comentarioPublicacion(@Param('pubId') pubId: string, @Query('limit') limit = 5) {
        const publicaciones = await this.comentariosService.mostrarComentariosPublicacion(pubId, Number(limit));
        return publicaciones;
        }
}
