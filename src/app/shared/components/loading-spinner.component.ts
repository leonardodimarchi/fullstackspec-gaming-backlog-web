import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex items-center justify-center py-12" [class.py-4]="small()">
      <div
        class="animate-spin rounded-full border-2 border-border border-t-primary"
        [class.h-8]="!small()"
        [class.w-8]="!small()"
        [class.h-5]="small()"
        [class.w-5]="small()"
      ></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly small = input(false);
}
