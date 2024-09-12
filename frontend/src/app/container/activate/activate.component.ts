import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css'
})
export class ActivateComponent implements OnInit {
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.activateUser(code);
      }
    });
  }

  activateUser(code: string) {
    this.authService.activateUser(code).subscribe(
      (response) => {
        this.message = 'Account activated successfully! Logging in...';
        this.messageType = 'success';

        // Automatically log in after activation
        this.autoLogin(response.username, response.token);
      },
      (error) => {
        this.message = error;
        this.messageType = 'error';
      }
    );
  }

  autoLogin(username: string, token: string) {
    this.authService.setToken(token);
    this.authService.setUsername(username);

    if (this.authService.isAuthenticated()) {
      // Add a 10-second delay before navigating to the home page
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 10000);
    } else {
      this.message = 'Login failed after activation: Invalid token';
      this.messageType = 'error';
    }
  }
}
