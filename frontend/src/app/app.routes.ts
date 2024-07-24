import { Routes } from '@angular/router';
import { DocumentsComponent } from './container/documents/documents.component';
import { HomeComponent } from './container/home/home.component';
import { DocumentTemplatesComponent } from './container/document-templates/document-templates.component';
import { SettingsComponent } from './container/settings/settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'document-templates', component: DocumentTemplatesComponent },
  { path: 'settings', component: SettingsComponent },
];
