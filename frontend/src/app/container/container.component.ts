import { Component } from '@angular/core';
import {DocumentsComponent} from "./documents/documents.component";

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    DocumentsComponent
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {

}
