import { Component } from '@angular/core';
import {DocumentsComponent} from "./documents/documents.component";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {DocumentTemplatesComponent} from "./document-templates/document-templates.component";
import {SettingsComponent} from "./settings/settings.component";

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    HomeComponent,
    DocumentsComponent,
    DocumentTemplatesComponent,
    SettingsComponent,
    RouterOutlet
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {

}
