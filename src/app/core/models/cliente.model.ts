import { Ciudad } from './ciudad.model';

export interface Cliente {
  idPersona?: number;
  idCiudad: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  ruc: string;
  direccion: string;
  celular: string;
  email: string;
  telefono: string;
  telefono_adicional: any;
  estado: string;
  ciudad: Ciudad;
}
