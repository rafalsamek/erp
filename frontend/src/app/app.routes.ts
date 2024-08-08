import { Routes } from '@angular/router';
import { DocumentsComponent } from './container/documents/documents.component';
import { HomeComponent } from './container/home/home.component';
import { TemplatesComponent } from './container/templates/templates.component';
import { SettingsComponent } from './container/settings/settings.component';
import { CategoriesComponent } from './container/categories/categories.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'settings', component: SettingsComponent },
];
