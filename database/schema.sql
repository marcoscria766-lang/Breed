-- GUILD STAT FORGE - Database Schema

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  minecraft_nick VARCHAR(255),
  discord_nick VARCHAR(255),
  role VARCHAR(50) DEFAULT 'CLIENT' CHECK (role IN ('CLIENT', 'ADMIN')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- ============================================
-- Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(10) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pokemon_name VARCHAR(255) NOT NULL,
  pokemon_dex_number INTEGER NOT NULL,
  pokemon_type_1 VARCHAR(50),
  pokemon_type_2 VARCHAR(50),
  sex VARCHAR(50) NOT NULL CHECK (sex IN ('MALE', 'FEMALE', 'GENDERLESS')),
  nature VARCHAR(255) NOT NULL,
  ability VARCHAR(255) NOT NULL,
  is_hidden_ability BOOLEAN DEFAULT false,
  is_shiny BOOLEAN DEFAULT false,
  ball_type VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  client_notes TEXT,
  team_notes TEXT,
  status VARCHAR(50) DEFAULT 'AWAITING_REVIEW' CHECK (status IN (
    'AWAITING_REVIEW', 'ANALYZING', 'IN_PRODUCTION', 'REVIEW', 
    'READY_FOR_DELIVERY', 'DELIVERED', 'CANCELED'
  )),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  canceled_at TIMESTAMP
);

-- ============================================
-- Order IVs Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_ivs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  hp INTEGER CHECK (hp >= 0 AND hp <= 31),
  attack INTEGER CHECK (attack >= 0 AND attack <= 31),
  defense INTEGER CHECK (defense >= 0 AND defense <= 31),
  sp_attack INTEGER CHECK (sp_attack >= 0 AND sp_attack <= 31),
  sp_defense INTEGER CHECK (sp_defense >= 0 AND sp_defense <= 31),
  speed INTEGER CHECK (speed >= 0 AND speed <= 31),
  iv_preset VARCHAR(50) CHECK (iv_preset IN ('F6', 'F5', 'F4', 'F3', 'F2', 'F1', '0IVS', 'CUSTOM')),
  UNIQUE(order_id)
);

-- ============================================
-- Order EVs Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_evs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  hp INTEGER DEFAULT 0 CHECK (hp >= 0 AND hp <= 252),
  attack INTEGER DEFAULT 0 CHECK (attack >= 0 AND attack <= 252),
  defense INTEGER DEFAULT 0 CHECK (defense >= 0 AND defense <= 252),
  sp_attack INTEGER DEFAULT 0 CHECK (sp_attack >= 0 AND sp_attack <= 252),
  sp_defense INTEGER DEFAULT 0 CHECK (sp_defense >= 0 AND sp_defense <= 252),
  speed INTEGER DEFAULT 0 CHECK (speed >= 0 AND speed <= 252),
  total_evs INTEGER DEFAULT 0 CHECK (total_evs >= 0 AND total_evs <= 510),
  has_custom_evs BOOLEAN DEFAULT false,
  UNIQUE(order_id)
);

-- ============================================
-- Order Moves Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_moves (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  move_1 VARCHAR(255),
  move_2 VARCHAR(255),
  move_3 VARCHAR(255),
  move_4 VARCHAR(255),
  UNIQUE(order_id)
);

-- ============================================
-- Order Status History Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by INTEGER NOT NULL REFERENCES users(id),
  notes TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Notifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ORDER_CREATED', 'STATUS_CHANGED', 'READY_FOR_DELIVERY', 'DELIVERED')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Audit Log Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  old_value TEXT,
  new_value TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_pokemon_name ON orders(pokemon_name);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);

-- ============================================
-- Initial Settings
-- ============================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('SITE_NAME', 'GUILD STAT FORGE', 'Nome do site'),
('DISCORD_WEBHOOK_URL', '', 'URL do webhook do Discord'),
('AVERAGE_DELIVERY_TIME_HOURS', '48', 'Tempo médio de entrega em horas'),
('THEME_PRIMARY_COLOR', '#3D2817', 'Cor primária (marrom escuro)'),
('THEME_SECONDARY_COLOR', '#8B7D6B', 'Cor secundária (cinza pedra)'),
('THEME_ACCENT_COLOR', '#D4AF37', 'Cor de destaque (dourado)')
ON CONFLICT DO NOTHING;
