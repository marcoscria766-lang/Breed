import { v4 as uuidv4 } from 'uuid';

/**
 * Gera um número único para a encomenda
 * Formato: #000001
 */
export const generateOrderNumber = (orderId: number): string => {
  return `#${String(orderId).padStart(6, '0')}`;
};

/**
 * Formata uma data para string legível em português
 */
export const formatDateBR = (date: Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Mapeia status para descrição amigável
 */
export const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    AWAITING_REVIEW: 'Aguardando Atendimento',
    ANALYZING: 'Em Análise',
    IN_PRODUCTION: 'Em Produção',
    REVIEW: 'Revisão',
    READY_FOR_DELIVERY: 'Pronto para Entrega',
    DELIVERED: 'Entregue',
    CANCELED: 'Cancelado',
  };
  return statusMap[status] || status;
};

/**
 * Mapeia status para cor (RGB)
 */
export const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    AWAITING_REVIEW: '#D4AF37', // Gold
    ANALYZING: '#8B7D6B', // Stone Gray
    IN_PRODUCTION: '#722F37', // Wine Red
    REVIEW: '#D4AF37', // Gold
    READY_FOR_DELIVERY: '#3D2817', // Dark Brown
    DELIVERED: '#8B7D6B', // Stone Gray
    CANCELED: '#722F37', // Wine Red
  };
  return colorMap[status] || '#8B7D6B';
};

/**
 * Calcula o preset de IVs
 */
export const calculateIVPreset = (ivs: any): string | null => {
  const ivsArray = [ivs.hp, ivs.attack, ivs.defense, ivs.sp_attack, ivs.sp_defense, ivs.speed];
  const perfectCount = ivsArray.filter((iv) => iv === 31).length;
  const zeroCount = ivsArray.filter((iv) => iv === 0).length;

  if (perfectCount === 6) return 'F6';
  if (perfectCount === 5) return 'F5';
  if (perfectCount === 4) return 'F4';
  if (perfectCount === 3) return 'F3';
  if (perfectCount === 2) return 'F2';
  if (perfectCount === 1) return 'F1';
  if (zeroCount === 6) return '0IVS';

  return null;
};

/**
 * Valida se um número está entre 0 e 31
 */
export const isValidIV = (value: number): boolean => {
  return Number.isInteger(value) && value >= 0 && value <= 31;
};

/**
 * Valida se um número está entre 0 e 252
 */
export const isValidEV = (value: number): boolean => {
  return Number.isInteger(value) && value >= 0 && value <= 252;
};
