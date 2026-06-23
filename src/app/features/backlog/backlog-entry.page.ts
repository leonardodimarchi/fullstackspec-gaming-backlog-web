import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { UserGamesService } from '../../core/services/user-games.service';
import { Availability } from '../../shared/enums/availability.enum';
import { FinishedType } from '../../shared/enums/finished-type.enum';
import { GameStatus } from '../../shared/enums/game-status.enum';
import {
  AVAILABILITIES,
  AVAILABILITY_LABELS,
  FINISHED_TYPES,
  FINISHED_TYPE_LABELS,
  GAME_STATUSES,
  GAME_STATUS_LABELS,
} from '../../shared/constants/labels';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { UserGame } from '../../shared/models/user-game.model';

@Component({
  selector: 'app-backlog-entry-page',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner />
    } @else if (entry(); as e) {
      <div class="max-w-2xl">
        <a routerLink="/backlog" class="btn-ghost mb-4">← Voltar ao backlog</a>

        <div class="mb-6 flex gap-4">
          @if (e.game?.coverUrl) {
            <img [src]="e.game!.coverUrl" [alt]="e.game!.name" class="h-32 w-24 rounded object-cover" />
          }
          <div>
            <h1 class="page-title">{{ e.game?.name ?? 'Jogo #' + e.igdbId }}</h1>
            <a [routerLink]="['/games', e.igdbId]" class="text-sm text-primary hover:underline">Ver no catálogo</a>
          </div>
        </div>

        <form class="card space-y-4 p-6" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label class="label" for="status">Status</label>
            <select id="status" class="select" formControlName="status">
              @for (s of statuses; track s) {
                <option [value]="s">{{ statusLabels[s] }}</option>
              }
            </select>
          </div>

          <div>
            <label class="label" for="availability">Disponibilidade</label>
            <select id="availability" class="select" formControlName="availability">
              <option value="">—</option>
              @for (a of availabilities; track a) {
                <option [value]="a">{{ availabilityLabels[a] }}</option>
              }
            </select>
          </div>

          <div>
            <label class="label" for="finishedType">Tipo de conclusão</label>
            <select id="finishedType" class="select" formControlName="finishedType">
              <option value="">—</option>
              @for (f of finishedTypes; track f) {
                <option [value]="f">{{ finishedTypeLabels[f] }}</option>
              }
            </select>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="label" for="expectedTime">Tempo esperado (h)</label>
              <input id="expectedTime" class="input" type="number" min="0" step="0.1" formControlName="expectedTime" />
            </div>
            <div>
              <label class="label" for="expectedTimeForAllContent">Tempo esperado 100% (h)</label>
              <input id="expectedTimeForAllContent" class="input" type="number" min="0" step="0.1" formControlName="expectedTimeForAllContent" />
            </div>
            <div>
              <label class="label" for="playedTime">Tempo jogado (h)</label>
              <input id="playedTime" class="input" type="number" min="0" step="0.1" formControlName="playedTime" />
            </div>
            <div>
              <label class="label" for="playedTimeForAllContent">Tempo jogado 100% (h)</label>
              <input id="playedTimeForAllContent" class="input" type="number" min="0" step="0.1" formControlName="playedTimeForAllContent" />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="label" for="startDate">Início</label>
              <input id="startDate" class="input" type="date" formControlName="startDate" />
            </div>
            <div>
              <label class="label" for="endDate">Fim (história)</label>
              <input id="endDate" class="input" type="date" formControlName="endDate" />
            </div>
            <div>
              <label class="label" for="endDateForAllContent">Fim (100%)</label>
              <input id="endDateForAllContent" class="input" type="date" formControlName="endDateForAllContent" />
            </div>
          </div>

          <div>
            <label class="label" for="notes">Notas</label>
            <textarea id="notes" class="input min-h-24" formControlName="notes"></textarea>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="submit" class="btn-primary" [disabled]="saving()">
              {{ saving() ? 'Salvando...' : 'Salvar' }}
            </button>
            <button type="button" class="btn-danger" [disabled]="deleting()" (click)="onDelete()">
              {{ deleting() ? 'Removendo...' : 'Remover do backlog' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
})
export class BacklogEntryPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userGamesService = inject(UserGamesService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly entry = signal<UserGame | null>(null);

  readonly statuses = GAME_STATUSES;
  readonly statusLabels = GAME_STATUS_LABELS;
  readonly availabilities = AVAILABILITIES;
  readonly availabilityLabels = AVAILABILITY_LABELS;
  readonly finishedTypes = FINISHED_TYPES;
  readonly finishedTypeLabels = FINISHED_TYPE_LABELS;

  readonly form = this.fb.group({
    status: [''],
    notes: [''],
    expectedTime: [null as number | null],
    expectedTimeForAllContent: [null as number | null],
    playedTime: [null as number | null],
    playedTimeForAllContent: [null as number | null],
    finishedType: [''],
    startDate: [''],
    endDate: [''],
    endDateForAllContent: [''],
    availability: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userGamesService.getById(id).subscribe({
      next: (entry) => {
        this.entry.set(entry);
        this.form.patchValue({
          status: entry.status,
          notes: entry.notes,
          expectedTime: entry.expectedTime ?? null,
          expectedTimeForAllContent: entry.expectedTimeForAllContent ?? null,
          playedTime: entry.playedTime ?? null,
          playedTimeForAllContent: entry.playedTimeForAllContent ?? null,
          finishedType: entry.finishedType ?? '',
          startDate: this.toDateInput(entry.startDate),
          endDate: this.toDateInput(entry.endDate),
          endDateForAllContent: this.toDateInput(entry.endDateForAllContent),
          availability: entry.availability ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        void this.router.navigate(['/backlog']);
      },
    });
  }

  onSubmit(): void {
    const id = this.entry()?.id;
    if (!id) return;

    this.saving.set(true);
    const v = this.form.getRawValue();

    this.userGamesService
      .update(id, {
        status: v.status as GameStatus,
        notes: v.notes ?? '',
        expectedTime: v.expectedTime ?? undefined,
        expectedTimeForAllContent: v.expectedTimeForAllContent ?? undefined,
        playedTime: v.playedTime ?? undefined,
        playedTimeForAllContent: v.playedTimeForAllContent ?? undefined,
        finishedType: v.finishedType ? (v.finishedType as FinishedType) : undefined,
        startDate: v.startDate ? new Date(v.startDate).toISOString() : undefined,
        endDate: v.endDate ? new Date(v.endDate).toISOString() : undefined,
        endDateForAllContent: v.endDateForAllContent
          ? new Date(v.endDateForAllContent).toISOString()
          : undefined,
        availability: v.availability ? (v.availability as Availability) : undefined,
      })
      .subscribe({
        next: (updated) => {
          this.entry.set(updated);
          this.saving.set(false);
          this.notification.show('Backlog atualizado!', 'success');
        },
        error: () => this.saving.set(false),
      });
  }

  onDelete(): void {
    const id = this.entry()?.id;
    if (!id || !confirm('Remover este jogo do backlog?')) return;

    this.deleting.set(true);
    this.userGamesService.remove(id).subscribe({
      next: () => {
        void this.router.navigate(['/backlog']);
      },
      error: () => this.deleting.set(false),
    });
  }

  private toDateInput(iso?: string): string {
    if (!iso) return '';
    return iso.slice(0, 10);
  }
}
