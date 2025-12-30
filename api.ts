
import { Contract, ContractStatus, PaymentStatus } from './types';

export const callServer = <T>(functionName: string, ...args: any[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      // @ts-ignore
      google.script.run
        .withSuccessHandler((res: T) => resolve(res))
        .withFailureHandler((err: Error) => reject(err))[functionName](...args);
    } else {
      console.warn(`Entorno local detectado: Simulando ${functionName}`);
      
      // Datos de prueba para que no se vea "negro" o vacío
      const mockData: any = {
        getContractsFromSheet: [
          { indice: 1, contrato: '1001', nombreMostrar: 'Juan Pérez', rut: '12.345.678-9', precio: 65000, estadoPago: PaymentStatus.PAGADO, statusServicio: ContractStatus.ACTIVO, autos: ['ABCD-12'], rowNumber: 2 },
          { indice: 2, contrato: '1002', nombreMostrar: 'Empresa Logística S.A.', rut: '77.888.999-0', precio: 120000, estadoPago: PaymentStatus.MOROSO, statusServicio: ContractStatus.ACTIVO, autos: ['GGHH-44', 'KKLL-22'], rowNumber: 3 },
          { indice: 3, contrato: '1003', nombreMostrar: 'María López', rut: '15.222.333-K', precio: 55000, estadoPago: PaymentStatus.PAGADO, statusServicio: ContractStatus.BLOQUEO, autos: ['XYZA-99'], rowNumber: 4 },
        ],
        getSheetMetadata: {
          name: "SGE Demo DB",
          id: "demo-id",
          rowCount: 3,
          lastUpdated: new Date().toLocaleString()
        }
      };

      setTimeout(() => {
        const result = mockData[functionName] || ([] as unknown as T);
        resolve(result);
      }, 800);
    }
  });
};

export interface SheetMetadata {
  name: string;
  id: string;
  rowCount: number;
  lastUpdated: string;
}

export const api = {
  getContracts: () => callServer<Contract[]>('getContractsFromSheet'),
  saveContract: (contract: Partial<Contract>) => callServer<{success: boolean}>('saveContractToSheet', contract),
  connectSheet: (id: string) => callServer<{success: boolean, name?: string, rowCount?: number}>('setLinkedSheetId', id),
  getMetadata: () => callServer<SheetMetadata | null>('getSheetMetadata'),
};
