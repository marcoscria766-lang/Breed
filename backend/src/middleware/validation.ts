import { Request, Response, NextFunction } from 'express';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
  // Alphanumeric, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateOrderData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.pokemon_name) errors.push('Nome do Pokémon é obrigatório');
  if (!data.sex) errors.push('Sexo é obrigatório');
  if (!data.nature) errors.push('Nature é obrigatória');
  if (!data.ability) errors.push('Ability é obrigatória');
  if (!data.ball_type) errors.push('Tipo de Poké Ball é obrigatório');

  if (data.sex && !['MALE', 'FEMALE', 'GENDERLESS'].includes(data.sex)) {
    errors.push('Sexo inválido');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateIVs = (ivs: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const stats = ['hp', 'attack', 'defense', 'sp_attack', 'sp_defense', 'speed'];

  for (const stat of stats) {
    if (ivs[stat] !== undefined) {
      if (typeof ivs[stat] !== 'number' || ivs[stat] < 0 || ivs[stat] > 31) {
        errors.push(`${stat} deve estar entre 0 e 31`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateEVs = (evs: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const stats = ['hp', 'attack', 'defense', 'sp_attack', 'sp_defense', 'speed'];
  let totalEVs = 0;

  for (const stat of stats) {
    if (evs[stat] !== undefined) {
      if (typeof evs[stat] !== 'number' || evs[stat] < 0 || evs[stat] > 252) {
        errors.push(`${stat} deve estar entre 0 e 252`);
      }
      totalEVs += evs[stat];
    }
  }

  if (totalEVs > 510) {
    errors.push(`Total de EVs não pode exceder 510 (atual: ${totalEVs})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
