// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  minecraft_nick?: string;
  discord_nick?: string;
  role: 'CLIENT' | 'ADMIN';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface AuthPayload {
  id: number;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  pokemon_name: string;
  pokemon_dex_number: number;
  pokemon_type_1?: string;
  pokemon_type_2?: string;
  sex: 'MALE' | 'FEMALE' | 'GENDERLESS';
  nature: string;
  ability: string;
  is_hidden_ability: boolean;
  is_shiny: boolean;
  ball_type: string;
  nickname?: string;
  client_notes?: string;
  team_notes?: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  delivered_at?: Date;
  canceled_at?: Date;
}

export type OrderStatus = 
  | 'AWAITING_REVIEW'
  | 'ANALYZING'
  | 'IN_PRODUCTION'
  | 'REVIEW'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED';

export interface OrderIVs {
  id: number;
  order_id: number;
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
  iv_preset?: string;
}

export interface OrderEVs {
  id: number;
  order_id: number;
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
  total_evs: number;
  has_custom_evs: boolean;
}

export interface OrderMoves {
  id: number;
  order_id: number;
  move_1?: string;
  move_2?: string;
  move_3?: string;
  move_4?: string;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  previous_status?: string;
  new_status: string;
  changed_by: number;
  notes?: string;
  changed_at: Date;
}

// Pokemon Types
export interface Pokemon {
  id: number;
  name: string;
  dex_number: number;
  type_1: string;
  type_2?: string;
  abilities: string[];
  hidden_ability?: string;
  can_be_shiny: boolean;
  genders: ('MALE' | 'FEMALE' | 'GENDERLESS')[];
  egg_groups: string[];
  forms: string[];
  level_up_moves: string[];
  tm_moves: string[];
  egg_moves: string[];
  tutor_moves?: string[];
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  order_id?: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}

export type NotificationType = 
  | 'ORDER_CREATED'
  | 'STATUS_CHANGED'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERED';

// Audit Log Types
export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
  created_at: Date;
}
