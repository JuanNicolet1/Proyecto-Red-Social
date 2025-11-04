import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    passwordHash: string;
    descripcion: string;
}

@Injectable()
export class AutenticacionService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  private cloudinaryService: CloudinaryService) {} // Inyecta el modelo
    
      async findOne(username: string): Promise<UserDocument | null> {
        // Busca en la base de datos por nombre de usuario
        return this.userModel.findOne({ username: username }).exec();
      }

      async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
      }
    
      async findAll(): Promise<UserDocument[]> {
      return this.userModel.find().exec();
      }
    
    
      async create(createUserDto: CrearUsuarioDto): Promise<UserDocument> {
        
        console.log('DTO recibido:', createUserDto);
        const saltRounds = 10; // Factor de coste para bcrypt
        // Hashea la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    
        const createdUser = new this.userModel({
          username: createUserDto.username,
          email: createUserDto.email,
          passwordHash: hashedPassword,
          nombre: createUserDto.nombre,
          apellido: createUserDto.apellido,
          fecha_nacimiento: createUserDto.fecha_nacimiento,
          descripcion: createUserDto.descripcion,
        });
        return createdUser.save();
      }

      async login(identificador: string, password: string): Promise<{ access_token: string }> {
        const usuario = await this.userModel.findOne({$or: [{ email: identificador }, { username: identificador }]}).exec();
        if (!usuario) {
            throw new NotFoundException('El usuario no existe');
        }

        const contrasena = await bcrypt.compare(password, usuario.passwordHash);
        if (!contrasena) {
            throw new NotFoundException('Contraseña incorrecta');
        }

        const payload = { sub: usuario._id.toString(), username: usuario.username };
        return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    async updatePerfilImagen(
        userId: string,
        file: Express.Multer.File
      ): Promise<UserDocument> {

        const usuario = await this.userModel.findById(userId).exec();
        
        if (!usuario) {
          throw new NotFoundException('El usuario no existe');
        }

        if(usuario.publicId) {
          await this.cloudinaryService.deleteImagen(usuario.publicId);
        }

        const uploadResultados = await this.cloudinaryService.uploadImage(file);
        usuario.imagenPerfil = uploadResultados.secure_url;
        usuario.publicId = uploadResultados.public_id;

        return usuario.save();
    }
}
