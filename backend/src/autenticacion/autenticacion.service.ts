import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

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
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} // Inyecta el modelo
    
      async findOne(username: string): Promise<UserDocument | null> {
        // Busca en la base de datos por nombre de usuario
        return this.userModel.findOne({ username: username }).exec();
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

      async login(email: string, password: string) {
        const usuario = await this.userModel.findOne({ email }).exec();
        if (!usuario) {
            throw new NotFoundException('El usuario no existe');
        }

        const contrasena = await bcrypt.compare(password, usuario.passwordHash);
        if (!contrasena) {
            throw new NotFoundException('Contraseña incorrecta');
        }

        const { passwordHash, ...usuarioSinPassword } = usuario.toObject();
        return usuarioSinPassword;
    }
}
