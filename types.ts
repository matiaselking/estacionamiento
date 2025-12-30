
export enum ContractStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  BLOQUEO = 'BLOQUEO',
  RENUNCIA = 'RENUNCIA'
}

export enum PaymentStatus {
  PAGADO = 'PAGADO',
  DEBE = 'DEBE',
  MOROSO = 'MOROSO'
}

export interface Contract {
  indice: number;
  contrato: string;
  empresa: string;
  nombre: string;
  nombreMostrar: string;
  esEmpresa: boolean;
  contactoNombre: string;
  rut: string;
  representante: string;
  mail1: string;
  mail2: string;
  direccion: string;
  comuna: string;
  telefono: string;
  celular: string;
  sector: string;
  tarjetas: number | string;
  nivelPrecio: string;
  precio: number;
  fInicio: string;
  fTermino: string;
  autos: string[];
  autorizados: string;
  estadoPago: PaymentStatus;
  statusServicio: ContractStatus;
  ultimoPago: string;
  pdfUrl?: string;
  // Added for spreadsheet row tracking
  rowNumber?: number;
}

export interface BankTransaction {
  id: string;
  fecha: string;
  monto: number;
  ordenante: string;
  cuenta: string;
  glosa: string;
  sugerido?: Partial<Contract>;
  score?: number;
}

export interface PriceLevel {
  nivel: string;
  precio: number;
}
