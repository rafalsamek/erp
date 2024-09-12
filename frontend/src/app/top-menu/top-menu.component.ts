import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from "@angular/common";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgIf],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css',
})
export class TopMenuComponent {
  constructor(public authService: AuthService) {}
}
