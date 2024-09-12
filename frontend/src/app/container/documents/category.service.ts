import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { CategoryEntity } from './category-entity.model';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

export interface CategoryResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: CategoryEntity[];
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
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    console.log(`API URL: ${this.apiUrl}`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  getCategories(
    page: number = 0,
    size: number = 2147483647,
    sortColumns: string = 'id',
    sortDirections: string = 'asc',
    searchBy: string = ''
  ): Observable<CategoryResponse> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .get<CategoryResponse>(
        `${this.apiUrl}?page=${page}&size=${size}&sortColumns=${sortColumns}&sortDirections=${sortDirections}&searchBy=${searchBy}`,
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  addCategory(category: CategoryEntity): Observable<CategoryEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .post<CategoryEntity>(this.apiUrl, category, { headers })
      .pipe(catchError(this.handleError));
  }

  updateCategory(category: CategoryEntity): Observable<CategoryEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .put<CategoryEntity>(`${this.apiUrl}/${category.id}`, category, { headers })
      .pipe(catchError(this.handleError));
  }

  getCategory(id: number): Observable<CategoryEntity> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .get<CategoryEntity>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteCategory(categoryId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.httpClient
      .delete<void>(`${this.apiUrl}/${categoryId}`, { headers })
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
