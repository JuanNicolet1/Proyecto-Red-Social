import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { Publicacion, PublicacionDocument } from './schemas/publicaciones.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PublicacionesModule } from './publicaciones.module';
import { filter } from 'rxjs';

@Injectable()
export class PublicacionesService {
    constructor(@InjectModel(Publicacion.name) private publicacionModel: Model<PublicacionDocument>,
    private cloudinaryService: CloudinaryService) {}

    offset = 0
    limit = 10
    activo_publicacion = true;

    // POST publicaciones
    async publicar(createPublicacioDto: CrearPublicacionDto, imagen?: Express.Multer.File): Promise<PublicacionDocument>{
        let imagenUrl = '';
        
        if(imagen){
            const result = await this.cloudinaryService.uploadImage(imagen);
            imagenUrl = result.secure_url;
        }
        const createPublicacion = new this.publicacionModel({
            usuario: createPublicacioDto.usuario,
            titulo: createPublicacioDto.titulo,
            descripcion: createPublicacioDto.descripcion,
            activo: createPublicacioDto.activo,
            fecha: createPublicacioDto.fecha,
            likes: createPublicacioDto.likes,
            imagen: imagenUrl
        });
        
        return createPublicacion.save();
    }

    // Da de baja una publicación solo si sos el autor o admin
    async deleteOne(id: string, usuarioSolicitante: string) {
        const publicacion = await this.publicacionModel.findById(id);

        if (!publicacion) {
            throw new Error('Publicación no encontrada');
        }

        
        publicacion.activo = false;

        return await publicacion.save();
    }


    // GET publicaciones
    mostrarPublicaciones(): Promise<PublicacionDocument[]> {
        return this.publicacionModel.find().exec() // find({activo: true})
    }

    async mostrarPorId(id: string): Promise<PublicacionDocument | null> {
            return this.publicacionModel.findById(id).exec();
    }

    // GET con filtros
    mostrarPublicacionesFiltro(filtro: string,
        offset = 0, limit = 10): Promise<PublicacionDocument[]> {
        let result
        if(filtro === "fecha"){
            result = this.publicacionModel.find( { activo: true }).sort({ fecha: -1 })
        }

        else if(filtro === "likes"){
            result = this.publicacionModel.find({ activo: true }).sort({ likes: -1 })
        }
        else {
            result = this.publicacionModel.find()
        }

        return result.skip(offset).limit(limit).exec()
    }

    // GET con filtros a usuarios en particular
    mostrarPublicacionesUsuario(usuario: string, 
        offset = 0, limit = 3
    ): Promise<PublicacionDocument[]> {
        let result
        result = this.publicacionModel.find({ usuario, activo: true}).sort({ fecha: -1 })
        

        return result.skip(offset).limit(limit).exec()
    }
    
    // Da like
    async darLike(idPublicacion: string, idUsuario: string) {
        const publicacionLike = await this.mostrarPorId(idPublicacion);

        if (!publicacionLike) {
            throw new Error('Publicación no encontrada');
        }

        const dioLike = publicacionLike.usuariosLikes.includes(idUsuario);

        if (dioLike) {
            return publicacionLike;
        }

        publicacionLike.usuariosLikes.push(idUsuario);

        publicacionLike.likes = publicacionLike.usuariosLikes.length;
        
        await publicacionLike.save();

        return publicacionLike;
    }

    // Da dislike
    async eliminarLike(idPublicacion: string, idUsuario: string) {
        const publicacionLike = await this.mostrarPorId(idPublicacion);

        if (!publicacionLike) {
            throw new Error('Publicación no encontrada');
        }

        const indiceUsuario = publicacionLike.usuariosLikes.indexOf(idUsuario);

        if (indiceUsuario !== -1) {
            publicacionLike.usuariosLikes.splice(indiceUsuario, 1);

            publicacionLike.likes = publicacionLike.usuariosLikes.length;
        
            await publicacionLike.save();
            } else {
                console.log(`El usuario ${idUsuario} no tiene like para eliminar.`);
            }

            return publicacionLike;
        }

    async publicacionesPorUsuario(desde: Date, hasta: Date) {
        return this.publicacionModel.aggregate([
        { $match: { fecha: { $gte: desde, $lte: hasta } } },
        { $group: { _id: '$usuario', cantidad: { $sum: 1 } } },
        { $project: { usuario: '$_id', cantidad: 1, _id: 0 } },
        { $sort: { cantidad: -1 } }
        ]).exec();
    }
}
