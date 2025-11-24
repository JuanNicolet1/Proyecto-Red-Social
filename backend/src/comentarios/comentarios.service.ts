import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CrearComentariosDto } from './dto/crear-comentario.dto';
import { Comentarios, ComentariosDocument } from './schemas/comentarios.schema';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class ComentariosService  {
    constructor(@InjectModel(Comentarios.name) private comentariosModel: Model<ComentariosDocument>) {}

    async crear(crearComentariosDto: CrearComentariosDto, pubId) : Promise<ComentariosDocument> {
        const crearComentarios = new this.comentariosModel({
            text: crearComentariosDto.text,
            usuario: crearComentariosDto.usuario,
            fecha: crearComentariosDto.fecha,
            pubId: pubId,
            edit: false,
        })

        return crearComentarios.save();
    }

    async editar(id: string, editarComentariosDto: CrearComentariosDto, pubId): Promise<ComentariosDocument> {
        const comentario = await this.comentariosModel.findById(id);

        if (!comentario) {
            throw new NotFoundException('Comentario no encontrado');
        }

        comentario.text = editarComentariosDto.text,
        comentario.pubId = pubId,
        comentario.edit = true

        return comentario.save();
    }

    async mostrarComentarios(limit = 5) : Promise<ComentariosDocument[]> {
        let resultado;
        resultado = this.comentariosModel.find()
        return resultado.limit(limit).exec()
    }

    async mostrarComentariosPublicacion(pubId: string, limit = 5): Promise<ComentariosDocument[]> {
        return this.comentariosModel.find({ pubId }).limit(limit).exec();
    }

    async comentariosTotalesPorDia(desde: Date, hasta: Date) {
    return this.comentariosModel.aggregate([
      { $match: { fecha: { $gte: desde, $lte: hasta } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$fecha" }
          },
          cantidad: { $sum: 1 }
        }
      },
      { $project: { fecha: '$_id', cantidad: 1, _id: 0 } },
      { $sort: { fecha: 1 } }
    ]).exec();
  }

  // Comentarios por publicación en rango
  async comentariosPorPublicacion(desde: Date, hasta: Date, limit = 10) {
  return this.comentariosModel.aggregate([
    // Filtrar por fecha
    { 
      $match: { 
        fecha: { $gte: desde, $lte: hasta }
      } 
    },

    // Agrupar por ID de publicación
    {
      $group: {
        _id: '$pubId',
        cantidad: { $sum: 1 }
      }
    },

    // Hacer join con la colección de publicaciones
    {
      $lookup: {
        from: 'publicacions',
        localField: '_id',
        foreignField: '_id',
        as: 'publicacion'
      }
    },

    {
      $unwind: {
        path: '$publicacion',
        preserveNullAndEmptyArrays: true
      }
    },

    { $sort: { cantidad: -1 } },

    { $limit: limit },
    {
      $project: {
        _id: 0,
        pubId: '$_id',
        cantidad: 1,
        titulo: '$publicacion.titulo'
      }
    }
  ]).exec();
}


}
