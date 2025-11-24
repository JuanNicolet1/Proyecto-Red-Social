import { Controller, Post, Body, Get, Delete, Query, UseInterceptors, UploadedFile, Param, UseGuards } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AutenticacionGuard } from 'src/autenticacion/autenticacion.guard';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private readonly publicacionService: PublicacionesService){}

    // Crea una publicación
    @Post('publicacion')
    @UseGuards(AutenticacionGuard)
    @UseInterceptors(FileInterceptor('imagen'))
    async publicacion(@Body() crearPublicacionDto: CrearPublicacionDto,
    @UploadedFile() file?: Express.Multer.File ) {
        
        try {
            const publicacion = await this.publicacionService.publicar(crearPublicacionDto, file)
            return publicacion;
        }
        catch (error) {
            console.error('Error al publicar:', error);
            throw error;
        }
    }

    @Delete(':id/eliminar/:usuario')
    @UseGuards(AutenticacionGuard)
    async eliminar(
        @Param('id') id: string,
        @Param('usuario') usuario: string
        ) {
        try {
            const resultado = await this.publicacionService.deleteOne(id, usuario);
            return resultado;
        } catch (error) {
            console.error('Error al desactivar publicación:', error);
            throw error;
        }
    }

    @Get('publicaciones-por-usuario')
    async publicacionesPorUsuario(
        @Query('desde') desdeStr: string,
        @Query('hasta') hastaStr: string,
        ) {
        const desde = new Date(desdeStr);
        const hasta = new Date(hastaStr);
        return await this.publicacionService.publicacionesPorUsuario(desde, hasta);
    }

    // Se muestran las publicaciones
    @Get()
    async inicio() {
        const publicaciones = await this.publicacionService.mostrarPublicaciones();
        return publicaciones;
    }

    @Get(':id')
    async inicioId(@Param('id') id: string) {
        {
            try {
                const resultado = await this.publicacionService.mostrarPorId(id);
                return resultado;
            } catch (error) {
                console.error('Error al desactivar publicación:', error);
                throw error;
            }
        }
    }

    // Muestra las publicaciones con un filtro
    @Get(':filtro/filtro')
        async filtro(@Param('filtro') filtro: string, 
        @Query('offset') offset = 0, @Query('limit') limit = 10) {
        const publicaciones = await this.publicacionService.mostrarPublicacionesFiltro(filtro,
        Number(offset), Number(limit));
        return publicaciones;
    }

    // Muestra las publicaciones de un usuario con un filtro
    @Get(':user/usuario')
    async usuarioPublicaciones(@Param('user') usuario: string,
    @Query('offset') offset = 0, @Query('limit') limit = 3){
        const publicaciones = await this.publicacionService.mostrarPublicacionesUsuario(usuario,
            Number(offset), Number(limit)
        );
        return publicaciones;
    }

    // Dar me gusta
    @Post(':id/like/:usuarioId')
    @UseGuards(AutenticacionGuard)
    async like(@Param('id') id: string, @Param('usuarioId') usuarioId: string){
        try{
            const like = await this.publicacionService.darLike(id, usuarioId)
            return like;
        }
        catch(error){
            console.error('Error al dar like:', error);
            throw error;
        }
    }

    // Sacar el me gusta
    @Delete(':id/sacar/:usuarioId')
    async sacar(@Param('id') id: string, @Param('usuarioId') usuarioId: string){
        try {
            const sacarLike = await this.publicacionService.eliminarLike(id, usuarioId)
            return sacarLike;
        } 
        catch(error){
            console.error('Error al sacar el like:', error);
            throw error;
        }
    }
}
