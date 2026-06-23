import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataItem } from '../models/metadata-item.model';

@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule],
  template: `
    <div class="searchable-select">
      <input
        class="input"
        type="text"
        [id]="inputId()"
        [placeholder]="placeholder()"
        [(ngModel)]="searchText"
        (input)="onInput()"
        (focus)="open.set(true)"
        (blur)="onBlur()"
        autocomplete="off"
      />

      @if (open() && (filteredItems().length || allowEmpty())) {
        <ul class="searchable-select__list" role="listbox">
          @if (allowEmpty()) {
            <li>
              <button type="button" class="searchable-select__option" (mousedown)="select(null)">
                {{ emptyLabel() }}
              </button>
            </li>
          }
          @for (item of filteredItems(); track item.id) {
            <li>
              <button
                type="button"
                class="searchable-select__option"
                [class.searchable-select__option--active]="item.id === value()"
                (mousedown)="select(item.id)"
              >
                {{ item.name }}
              </button>
            </li>
          }
        </ul>
      } @else if (open() && searchText.trim() && filteredItems().length === 0) {
        <div class="searchable-select__empty">Nenhum resultado</div>
      }
    </div>
  `,
})
export class SearchableSelectComponent {
  readonly inputId = input('');
  readonly placeholder = input('Buscar...');
  readonly emptyLabel = input('Todos');
  readonly allowEmpty = input(true);
  readonly items = input<MetadataItem[]>([]);
  readonly value = input<number | null>(null);
  readonly valueChange = output<number | null>();

  readonly open = signal(false);
  searchText = '';

  readonly filteredItems = () => {
    const term = this.searchText.trim().toLowerCase();
    const items = this.items();
    if (!term) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.slug.toLowerCase().includes(term),
    );
  };

  constructor() {
    effect(() => {
      if (this.open()) return;
      const selected = this.items().find((item) => item.id === this.value());
      this.searchText = selected?.name ?? '';
    });
  }

  onInput(): void {
    this.open.set(true);
  }

  onBlur(): void {
    setTimeout(() => {
      this.open.set(false);
      const selected = this.items().find((item) => item.id === this.value());
      this.searchText = selected?.name ?? '';
    }, 150);
  }

  select(id: number | null): void {
    this.valueChange.emit(id);
    this.open.set(false);
    const selected = id === null ? null : this.items().find((item) => item.id === id);
    this.searchText = selected?.name ?? '';
  }
}
