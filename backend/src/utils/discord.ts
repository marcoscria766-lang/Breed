import axios from 'axios';
import { Order } from '../types';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

export interface DiscordMessage {
  content?: string;
  embeds?: any[];
}

export const sendDiscordMessage = async (message: DiscordMessage): Promise<void> => {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('⚠️ Discord webhook URL not configured');
    return;
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, message);
    console.log('✓ Discord message sent successfully');
  } catch (error) {
    console.error('✗ Failed to send Discord message:', error);
  }
};

export const formatOrderForDiscord = (order: any, user: any): DiscordMessage => {
  const ivsText = `HP: ${order.ivs.hp} | ATK: ${order.ivs.attack} | DEF: ${order.ivs.defense} | SPA: ${order.ivs.sp_attack} | SPD: ${order.ivs.sp_defense} | SPE: ${order.ivs.speed}`;
  const evsText = `HP: ${order.evs.hp} | ATK: ${order.evs.attack} | DEF: ${order.evs.defense} | SPA: ${order.evs.sp_attack} | SPD: ${order.evs.sp_defense} | SPE: ${order.evs.speed}`;
  const movesText = [
    order.moves.move_1,
    order.moves.move_2,
    order.moves.move_3,
    order.moves.move_4,
  ]
    .filter(Boolean)
    .join(', ') || 'Nenhum movimento selecionado';

  return {
    embeds: [
      {
        title: `📦 Nova Encomenda: #${order.order_number}`,
        color: 13617928, // Gold color
        fields: [
          {
            name: '👤 Cliente',
            value: `**${user.username}**\nMinecraft: ${user.minecraft_nick || 'N/A'}\nDiscord: ${user.discord_nick || 'N/A'}`,
            inline: false,
          },
          {
            name: '🐉 Pokémon',
            value: `**${order.pokemon_name}** (#${order.pokemon_dex_number})\n${order.pokemon_type_1}${order.pokemon_type_2 ? ` / ${order.pokemon_type_2}` : ''}`,
            inline: false,
          },
          {
            name: '⚙️ Configurações',
            value: `Nature: ${order.nature}\nAbility: ${order.ability}${order.is_hidden_ability ? ' (Hidden)' : ''}\nShiny: ${order.is_shiny ? 'Sim' : 'Não'}`,
            inline: false,
          },
          {
            name: '📊 IVs',
            value: ivsText,
            inline: false,
          },
          {
            name: '📈 EVs',
            value: evsText,
            inline: false,
          },
          {
            name: '🎯 Movimentos',
            value: movesText,
            inline: false,
          },
          {
            name: '🎪 Poké Ball',
            value: order.ball_type,
            inline: true,
          },
          {
            name: '📝 Nickname',
            value: order.nickname || 'N/A',
            inline: true,
          },
          ...(order.client_notes
            ? [{
                name: '💬 Observações do Cliente',
                value: order.client_notes,
                inline: false,
              }]
            : []),
        ],
        footer: {
          text: `Data: ${new Date().toLocaleString('pt-BR')}`,
        },
      },
    ],
  };
};

export const formatOrderStatusUpdate = (order: any, oldStatus: string, newStatus: string, changedBy: string): DiscordMessage => {
  return {
    embeds: [
      {
        title: `🔄 Status Atualizado: #${order.order_number}`,
        color: 13617928,
        fields: [
          {
            name: 'Pokémon',
            value: `${order.pokemon_name} (#${order.pokemon_dex_number})`,
            inline: true,
          },
          {
            name: 'Status Anterior',
            value: oldStatus,
            inline: true,
          },
          {
            name: 'Novo Status',
            value: newStatus,
            inline: true,
          },
          {
            name: 'Alterado por',
            value: changedBy,
            inline: true,
          },
        ],
        footer: {
          text: `Data: ${new Date().toLocaleString('pt-BR')}`,
        },
      },
    ],
  };
};
