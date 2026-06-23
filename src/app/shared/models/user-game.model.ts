import { Availability } from '../enums/availability.enum';
import { FinishedType } from '../enums/finished-type.enum';
import { GameStatus } from '../enums/game-status.enum';
import { Game } from './game.model';

export interface UserGame {
  id: string;
  userId: string;
  igdbId: number;
  status: GameStatus;
  notes: string;
  expectedTime?: number;
  expectedTimeForAllContent?: number;
  playedTime?: number;
  playedTimeForAllContent?: number;
  finishedType?: FinishedType;
  startDate?: string;
  endDate?: string;
  endDateForAllContent?: string;
  availability?: Availability;
  createdAt: string;
  updatedAt: string;
  game?: Game;
}
