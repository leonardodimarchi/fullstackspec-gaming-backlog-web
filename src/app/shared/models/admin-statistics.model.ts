import { Availability } from '../enums/availability.enum';
import { GameStatus } from '../enums/game-status.enum';

export interface AdminStatistics {
  totalUsers: number;
  usersByRole: { admin: number; user: number };
  totalUserGames: number;
  userGamesByStatus: Record<GameStatus, number>;
  userGamesByAvailability: Record<Availability, number>;
  totalPlayedHours: number;
  totalPlayedHoursAllContent: number;
}
