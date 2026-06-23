import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly message = signal<string | null>(null);
  readonly type = signal<'error' | 'success' | 'info'>('info');

  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: 'error' | 'success' | 'info' = 'info'): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }
    this.message.set(message);
    this.type.set(type);
    this.dismissTimer = setTimeout(() => this.clear(), type === 'error' ? 6000 : 3500);
  }

  clear(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.message.set(null);
  }
}
