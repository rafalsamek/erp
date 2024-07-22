import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {DocumentEntity} from "./document-entity.model";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api/documents`


  constructor(private httpClient: HttpClient) {
    console.log(`API URL: ${this.apiUrl}`);
  }

  getDocuments(): Observable<DocumentEntity[]> {
    return this.httpClient.get<any>(this.apiUrl).pipe(
      map(response => response.content as DocumentEntity[])
    );
  }
}
