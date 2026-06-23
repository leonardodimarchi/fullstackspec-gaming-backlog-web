import { Availability } from '../enums/availability.enum';
import { FinishedType } from '../enums/finished-type.enum';
import { GameSortField } from '../enums/game-sort-field.enum';
import { GameStatus } from '../enums/game-status.enum';
import { UserRole } from '../enums/user-role.enum';

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  [GameStatus.PLAYING]: 'Jogando',
  [GameStatus.WANT_TO_PLAY_NEXT]: 'Quero jogar',
  [GameStatus.WATCH_LIST]: 'Lista de espera',
  [GameStatus.FINISHED]: 'Finalizado',
  [GameStatus.ABANDONED]: 'Abandonado',
};

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  [Availability.PURCHASED]: 'Comprado',
  [Availability.RECEIVED_FREE]: 'Recebido grátis',
  [Availability.FREE_TO_PLAY]: 'Free to play',
  [Availability.DONT_HAVE]: 'Não tenho',
  [Availability.SUBSCRIPTION]: 'Assinatura',
};

export const FINISHED_TYPE_LABELS: Record<FinishedType, string> = {
  [FinishedType.MAIN_STORY]: 'História principal',
  [FinishedType.ALL_CONTENT]: '100%',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.USER]: 'Usuário',
};

export const GAME_SORT_LABELS: Record<GameSortField, string> = {
  [GameSortField.POPULARITY]: 'Popularidade',
  [GameSortField.NAME]: 'Nome',
  [GameSortField.RELEASE_DATE]: 'Data de lançamento',
  [GameSortField.RATING]: 'Nota IGDB',
  [GameSortField.HYPES]: 'Expectativa (pré-lançamento)',
};

export const GAME_STATUSES = Object.values(GameStatus);
export const AVAILABILITIES = Object.values(Availability);
export const FINISHED_TYPES = Object.values(FinishedType);
export const USER_ROLES = Object.values(UserRole);
export const GAME_SORT_FIELDS = Object.values(GameSortField);
