import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminStatistics } from '../../shared/models/admin-statistics.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStatistics() {
    return this.http.get<AdminStatistics>(`${environment.apiUrl}/admin/statistics`);
  }
}
