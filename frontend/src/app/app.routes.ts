import { Routes } from '@angular/router';
import { DocumentsComponent } from './container/documents/documents.component';
import { HomeComponent } from './container/home/home.component';
import { TemplatesComponent } from './container/templates/templates.component';
import { SettingsComponent } from './container/settings/settings.component';
import { CategoriesComponent } from './container/categories/categories.component';
import { authGuard } from './auth.guard';
import {ActivateComponent} from "./container/activate/activate.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'activate', component: ActivateComponent },
  { path: 'documents', component: DocumentsComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
  { path: 'templates', component: TemplatesComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
];
