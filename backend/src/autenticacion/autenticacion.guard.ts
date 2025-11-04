import {
  CanActivate,          // Interfaz que debe implementar cualquier Guard
  ExecutionContext,     // Proporciona detalles sobre la solicitud entrante (request, response, etc.)
  Injectable,           // Permite que NestJS inyecte dependencias (como JwtService)
  UnauthorizedException,// Excepción estándar para errores 401 (No autorizado)
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Servicio para manejar JWT (verificar, firmar)
import { jwtConstants } from './constants'; // Importa constantes, como la clave secreta para JWT
import { Request } from 'express'; // Tipado para el objeto Request de Express

@Injectable() 
export class AutenticacionGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Método principal del Guard. Decide si la solicitud actual tiene permiso para continuar.
   * @param context El contexto de ejecución actual (contiene el objeto request).
   * @returns Una promesa que resuelve a `true` si la solicitud está autorizada, o lanza `UnauthorizedException` si no lo está.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    try {

      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );

      request['user'] = payload;

    } catch (error) {

      throw new UnauthorizedException('Token inválido o expirado');
    }

    // Si llegamos hasta aquí, significa que el token es válido.
    // Devolvemos 'true' para permitir que la solicitud continúe hacia el controlador.
    return true;
  }

  /**
   * Función auxiliar para extraer el token JWT del encabezado 'Authorization'.
   * Espera el formato "Bearer <token>".
   * @param request El objeto de solicitud HTTP.
   * @returns El token (string) si se encuentra y tiene el formato correcto, o `undefined` si no.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    // Obtenemos el valor del encabezado 'Authorization'. Si no existe, usamos '?? []' para evitar errores.
    // Usamos ?. (optional chaining) por si 'authorization' no existe.
    // Hacemos split(' ') para separar "Bearer" del token.
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Verificamos si el tipo es 'Bearer' (ignorando mayúsculas/minúsculas podría ser más robusto, pero aquí es estricto).
    // Si es 'Bearer', devolvemos el token; si no, devolvemos undefined.
    return type === 'Bearer' ? token : undefined;
  }
}