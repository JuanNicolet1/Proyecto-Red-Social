import { Controller, Post, Param, Body, Get, HttpCode, HttpStatus, UseInterceptors, UseGuards, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, NotFoundException, UnauthorizedException, Delete } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { Request } from '@nestjs/common';
import { AutenticacionGuard } from './autenticacion.guard';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(private readonly autenticacionService: AutenticacionService) {}

    // GET para validar tokens
      @Get('autorizar')
      @UseGuards(AutenticacionGuard)
      async autorizar(@Req() req: any) {
        // El guard decodifica el token y te deja req.user
        const userId = req.user.sub;

        const usuario = await this.autenticacionService.findById(userId);

        if (!usuario) {
          throw new NotFoundException('Usuario no encontrado');
        }

        // eliminar hash
        const { passwordHash, ...usuarioSinPassword } = usuario.toObject();

        return { usuario: usuarioSinPassword };
      }

      @Post('refresh')
      async refreshToken(@Body('token') token: string) {
        try {
          const nuevoToken = await this.autenticacionService.refresh(token);
          return { access_token: nuevoToken };
        } catch (error) {
          throw new UnauthorizedException('Token inválido o expirado');
        }
      }


    
    // POST para registrar un usuario
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

    // POST para loguear a un usuario
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

    @Delete('eliminar/:id')
    async deshabilitar(@Param('id') id: string) {
      try {
        const user = await this.autenticacionService.deshabilitar(id);
        return user;
      }
      catch (error) {
        console.error('Error en deshabilitar usuario:', error);
        throw error;
      }
    }

    @Post('rehabilitar/:id')
    async rehabilitar(@Param('id') id: string) {
      try {
        const user = await this.autenticacionService.rehabilitar(id);
        return user;
      }
      catch (error) {
        console.error('Error en deshabilitar usuario:', error);
        throw error;
      }
    }
    
    // GET para obtener los usuario (hecho para testeos)
    @Get()
      async findAll() {
        const users = await this.autenticacionService.findAll();
        return users.map(user => {
          const { passwordHash, ...rest } = user.toObject();
          return rest;
        });
      }

      @Get('habilitados')
      async findAllHabilitados() {
        const users = await this.autenticacionService.findAllHabilitados();
        return users.map(user => {
          const { passwordHash, ...rest } = user.toObject();
          return rest;
        });
      }

      // GET para obtener usuarios por id
      @Get(':id')
      async findOne(@Param('id') id: string) {
        const user = await this.autenticacionService.findById(id);
        if(user){
        const { passwordHash, ...rest } = user.toObject();
        return rest;
        }
      }

      
}
