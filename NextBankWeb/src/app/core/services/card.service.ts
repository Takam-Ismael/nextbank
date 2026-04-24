import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CardResponse {
  id: number;
  userId: number;
  accountId: number;
  accountNumber: string;
  cardLastFour: string;
  cardType: string;       // VISA | MASTERCARD
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  status: string;         // ACTIVE | FROZEN
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private http = inject(HttpClient);
  private cardsUrl = `${environment.cardsApiUrl}/api/cards`;

  private headers(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** GET /api/cards/admin/all - paginated */
  getAllCards(page = 0, size = 100): Observable<any> {
    return this.http.get<any>(
      `${this.cardsUrl}/admin/all?page=${page}&size=${size}`,
      { headers: this.headers() }
    );
  }

  /** PATCH /api/cards/admin/{id}/freeze - toggle freeze */
  toggleFreeze(cardId: number): Observable<CardResponse> {
    return this.http.patch<CardResponse>(
      `${this.cardsUrl}/admin/${cardId}/freeze`,
      {},
      { headers: this.headers() }
    );
  }
}
