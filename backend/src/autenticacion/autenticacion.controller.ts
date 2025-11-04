import { Controller, Post, Param, Body, Get, HttpCode, HttpStatus, UseInterceptors, UseGuards, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { Request } from '@nestjs/common';
import { AutenticacionGuard } from './autenticacion.guard';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(private readonly autenticacionService: AutenticacionService) {}
    
    @Post('register')
    @UseInterceptors(FileInterceptor('imagen')) // 'imagen' es el nombre del campo en FormData
    @HttpCode(HttpStatus.CREATED)
    async register(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
            new FileTypeValidator({ fileType: /\/(jpg|jpeg|png|gif)$/ }),
          ],
        }),
      )
      file: Express.Multer.File,
      @Body() crearUsuarioDto: CrearUsuarioDto,
      ) {

      try {
        const user = await this.autenticacionService.create(crearUsuarioDto);
        const payload = { sub: user._id.toString(), username: user.username };
        if (file) {
          await this.autenticacionService.updatePerfilImagen(user._id.toString(), file);
        }
        const { passwordHash, ...result } = user.toObject();
        return result;
      } catch (error) {
        console.error('Error en register:', error);
        throw error;
      }
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        try {
            const user = await this.autenticacionService.login(body.email, body.password);
            return user;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    
    
    
    @Get()
      async findAll() {
        const users = await this.autenticacionService.findAll();
        return users.map(user => {
          const { passwordHash, ...rest } = user.toObject();
          return rest;
        });
      }
}
