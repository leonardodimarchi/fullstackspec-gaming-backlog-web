import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-layout__brand">
        <span class="text-primary">Gaming</span> Backlog
      </div>
      <router-outlet />
    </div>
  `,
})
export class AuthLayoutComponent {}
