import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { DocumentEntity } from './document-entity.model';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

export interface DocumentResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: DocumentEntity[];
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
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api/documents`;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    console.log(`API URL: ${this.apiUrl}`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  getDocuments(
    page: number,
    size: number,
    sortColumns: string,
    sortDirections: string,
    searchBy: string
  ): Observable<DocumentResponse> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .get<DocumentResponse>(
        `${this.apiUrl}?page=${page}&size=${size}&sortColumns=${sortColumns}&sortDirections=${sortDirections}&searchBy=${searchBy}`,
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  addDocument(document: DocumentEntity): Observable<DocumentEntity> {
    const formData = this.buildFormData(document);
    const headers = this.getAuthHeaders();

    return this.httpClient
      .post<DocumentEntity>(this.apiUrl, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  updateDocument(document: DocumentEntity): Observable<DocumentEntity> {
    const headers = this.getAuthHeaders();
    const formData = this.buildFormData(document);

    return this.httpClient
      .put<DocumentEntity>(`${this.apiUrl}/${document.id}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  getDocument(id: number): Observable<DocumentEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .get<DocumentEntity>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteDocument(documentId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${documentId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private buildFormData(document: DocumentEntity): FormData {
    const formData = new FormData();
    formData.append('id', document.id.toString());
    formData.append('title', document.title);
    if (document.description) {
      formData.append('description', document.description);
    }
    if (document.templateId) {
      formData.append('templateId', document.templateId.toString());
    }
    if (document.file) {
      formData.append('file', document.file);
    }
    if (document.categoryIds && document.categoryIds.length > 0) {
      document.categoryIds.forEach((categoryId) => {
        formData.append('categoryIds', categoryId.toString());
      });
    }

    return formData;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string[] = ['An unknown error occurred!'];
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = [`Client-side error: ${error.error.message}`];
    } else if (
      error.status === 400 &&
      error.error &&
      typeof error.error === 'object'
    ) {
      // Handle validation errors for 400 Bad Request
      const validationErrors = error.error;
      errorMessage = Object.entries(validationErrors).map(
        ([field, msg]) => `${field}: ${msg}`
      );
    } else {
      errorMessage = [
        `Server returned code: ${error.status}, error message is: ${error.message}`,
      ];
    }
    return throwError(errorMessage);
  }
}
