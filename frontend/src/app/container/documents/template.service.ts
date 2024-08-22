import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TemplateEntity } from './template-entity.model';

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

  constructor(private httpClient: HttpClient) {
    console.log(`API URL: ${this.apiUrl}`);
  }

  getTemplates(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): Observable<TemplateResponse> {
    return this.httpClient
      .get<TemplateResponse>(
        `${this.apiUrl}?page=${page}&size=${size}&sortColumns=${sortColumns}&sortDirections=${sortDirections}&searchBy=${searchBy}`
      )
      .pipe(catchError(this.handleError));
  }

  addTemplate(template: TemplateEntity): Observable<TemplateEntity> {
    return this.httpClient
      .post<TemplateEntity>(this.apiUrl, template)
      .pipe(catchError(this.handleError));
  }

  updateTemplate(template: TemplateEntity): Observable<TemplateEntity> {
    return this.httpClient
      .put<TemplateEntity>(`${this.apiUrl}/${template.id}`, template)
      .pipe(catchError(this.handleError));
  }

  getTemplate(id: number): Observable<TemplateEntity> {
    return this.httpClient
      .get<TemplateEntity>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteTemplate(templateId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${templateId}`)
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
