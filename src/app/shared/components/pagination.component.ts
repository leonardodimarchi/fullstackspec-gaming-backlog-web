import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    @if (totalPages() > 1) {
      <div class="flex items-center justify-center gap-2 py-4">
        <button
          type="button"
          class="btn-ghost"
          [disabled]="page() <= 1"
          (click)="pageChange.emit(page() - 1)"
        >
          Anterior
        </button>
        <span class="px-3 text-sm text-text-muted">
          Página {{ page() }} de {{ totalPages() }}
        </span>
        <button
          type="button"
          class="btn-ghost"
          [disabled]="page() >= totalPages()"
          (click)="pageChange.emit(page() + 1)"
        >
          Próxima
        </button>
      </div>
    }
  `,
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();
}
