import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TemplateEntity } from './template-entity.model';
import { AuthService } from '../../auth.service';

export interface TemplateResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: TemplateEntity[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private apiUrl = `${environment.apiUrl}/api/templates`;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    console.log(`API URL: ${this.apiUrl}`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTemplates(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): Observable<TemplateResponse> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .get<TemplateResponse>(
        `${this.apiUrl}?page=${page}&size=${size}&sortColumns=${sortColumns}&sortDirections=${sortDirections}&searchBy=${searchBy}`,
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  addTemplate(template: TemplateEntity): Observable<TemplateEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .post<TemplateEntity>(this.apiUrl, template, { headers })
      .pipe(catchError(this.handleError));
  }

  updateTemplate(template: TemplateEntity): Observable<TemplateEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .put<TemplateEntity>(`${this.apiUrl}/${template.id}`, template, { headers })
      .pipe(catchError(this.handleError));
  }

  getTemplate(id: number): Observable<TemplateEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .get<TemplateEntity>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteTemplate(templateId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${templateId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string[] = ['An unknown error occurred!'];
    if (error.error instanceof ErrorEvent) {
      errorMessage = [`Error: ${error.error.message}`];
    } else if (error.error && typeof error.error === 'object') {
      const validationErrors = error.error;
      errorMessage = Object.entries(validationErrors).map(
        ([field, msg]) => `${msg}`
      );
    } else {
      errorMessage = [
        `Server returned code: ${error.status}, error message is: ${error.message}`,
      ];
    }
    return throwError(errorMessage);
  }
}
