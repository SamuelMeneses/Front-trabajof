export const GAME_TYPES = ['Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'] as const;
export const TICKET_STATUSES = ['Pendiente', 'Ganado', 'Perdido'] as const;

export type GameType = (typeof GAME_TYPES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export type Ticket = {
  id: string;
  title: string;
  gameType: GameType;
  gameNumber?: string;
  gameDate: string;
  amount?: number;
  place?: string;
  status: TicketStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: {
    name?: string;
    email?: string;
  };
};
