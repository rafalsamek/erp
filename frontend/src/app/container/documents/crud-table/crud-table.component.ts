import { Component, Input } from '@angular/core';
import {DocumentEntity} from "../../../models";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.css'
})
export class CrudTableComponent {
  @Input() documentsList: DocumentEntity[] = [];
}
