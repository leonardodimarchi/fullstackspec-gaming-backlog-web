import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  template: `
    @if (notification.message(); as msg) {
      <div
        class="toast"
        [class.toast--error]="notification.type() === 'error'"
        [class.toast--success]="notification.type() === 'success'"
        [class.toast--info]="notification.type() === 'info'"
        role="status"
      >
        <span>{{ msg }}</span>
        <button type="button" class="toast__close" (click)="notification.clear()" aria-label="Fechar">
          ✕
        </button>
      </div>
    }
  `,
})
export class ToastContainerComponent {
  readonly notification = inject(NotificationService);
}
