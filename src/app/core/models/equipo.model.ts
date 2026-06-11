import { Tipo } from './tipo.model';

export interface Equipo {
  idEquipo?: number;
  idTipo: number;
  marca: string;
  modelo: string;
  serie: string;
  mainboard?: string;
  procesador?: string;
  memoria?: string;
  discoDuro?: string;
  fuente?: string;
  case?: string;
  estado: string; // 'A' para Activo, 'I' para Inactivo
  tipo?: Tipo; // Opcional, para mostrar el nombre del tipo en la tabla
}
