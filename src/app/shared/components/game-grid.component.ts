import { Component, input } from '@angular/core';
import { GameCardComponent } from './game-card.component';
import { Game } from '../models/game.model';

@Component({
  selector: 'app-game-grid',
  imports: [GameCardComponent],
  template: `
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      @for (game of games(); track game.igdbId) {
        <app-game-card [game]="game" />
      }
    </div>
  `,
})
export class GameGridComponent {
  readonly games = input.required<Game[]>();
}
