import { Controller, Post, Param, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(private readonly autenticacionService: AutenticacionService) {}
    
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() crearUsuarioDto: CrearUsuarioDto) {
      try {
        const user = await this.autenticacionService.create(crearUsuarioDto);
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
