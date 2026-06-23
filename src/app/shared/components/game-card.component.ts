import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '../models/game.model';

@Component({
  selector: 'app-game-card',
  imports: [RouterLink, DecimalPipe],
  template: `
    <a [routerLink]="['/games', game().igdbId]" class="game-card block h-full">
      <div class="aspect-[3/4] overflow-hidden bg-surface-overlay">
        @if (game().coverUrl) {
          <img
            [src]="game().coverUrl"
            [alt]="game().name"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        } @else {
          <div class="flex h-full items-center justify-center text-text-muted text-sm p-4 text-center">
            Sem capa
          </div>
        }
      </div>
      <div class="game-card__footer p-3">
        <h3 class="truncate font-semibold text-sm">{{ game().name }}</h3>
        <p class="game-card__meta mt-1 text-xs text-text-muted">
          @if (game().rating !== undefined && game().rating !== null) {
            <span>★ {{ game().rating | number: '1.0-0' }}/100</span>
          } @else {
            <span class="opacity-50">Sem nota</span>
          }
        </p>
      </div>
    </a>
  `,
})
export class GameCardComponent {
  readonly game = input.required<Game>();
}
