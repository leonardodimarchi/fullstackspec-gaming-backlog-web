import { Component, input, output } from '@angular/core';
import { GameStatus } from '../enums/game-status.enum';
import { GAME_STATUS_LABELS, GAME_STATUSES } from '../constants/labels';

@Component({
  selector: 'app-status-tabs',
  template: `
    <div class="flex flex-wrap gap-2 border-b border-border pb-3">
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
        [class.bg-primary]="active() === null"
        [class.text-white]="active() === null"
        [class.text-text-muted]="active() !== null"
        [class.hover:bg-surface-overlay]="active() !== null"
        (click)="statusChange.emit(null)"
      >
        Todos
        @if (counts()) {
          <span class="ml-1 opacity-70">({{ totalCount() }})</span>
        }
      </button>
      @for (status of statuses; track status) {
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          [class.bg-primary]="active() === status"
          [class.text-white]="active() === status"
          [class.text-text-muted]="active() !== status"
          [class.hover:bg-surface-overlay]="active() !== status"
          (click)="statusChange.emit(status)"
        >
          {{ labels[status] }}
          @if (counts(); as c) {
            <span class="ml-1 opacity-70">({{ c[status] }})</span>
          }
        </button>
      }
    </div>
  `,
})
export class StatusTabsComponent {
  readonly active = input<GameStatus | null>(null);
  readonly counts = input<Record<GameStatus, number> | null>(null);
  readonly statusChange = output<GameStatus | null>();

  readonly statuses = GAME_STATUSES;
  readonly labels = GAME_STATUS_LABELS;

  totalCount(): number {
    const c = this.counts();
    if (!c) return 0;
    return Object.values(c).reduce((sum, n) => sum + n, 0);
  }
}
