import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  loginData = {
    username: '',
    password: ''
  };

  registerData = {
    username: '',
    email: '',
    password: ''
  };

  isLoggedIn: boolean = false;
  message: string = '';
  formType: 'login' | 'register' | '' = '';
  messageType: 'success' | 'error' | '' = '';
  validationErrors: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkLoginStatus();  // Check if the user is logged in on component load
  }

  // Check if the user is logged in by checking if the token exists
  checkLoginStatus() {
    this.isLoggedIn = this.authService.isAuthenticated(); // Use the service to check if authenticated

    if (this.isLoggedIn) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.loginData.username = storedUsername; // Retrieve the username from localStorage
      }
    }
  }

  login() {
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(
      (response) => {
        this.message = 'Login successful!';
        this.messageType = 'success';
        this.isLoggedIn = true; // Update the state after login

        // Store the username in localStorage and keep it in loginData
        localStorage.setItem('username', this.loginData.username);
        this.formType = 'login';
        this.validationErrors = {};

        // Only clear the password field, not the username
        this.clearPasswordField();
      },
      (error) => {
        this.handleBackendErrors(error);
        this.formType = 'login';
      }
    );
  }

  register() {
    this.authService.register(this.registerData.username, this.registerData.email, this.registerData.password).subscribe(
      (response) => {
        this.message = 'Registration successful!\nPlease check your email for the activation link.';
        this.messageType = 'success';
        this.formType = 'register';
        this.validationErrors = {};

        // Clear the registration form
        this.clearRegisterForm();
      },
      (error) => {
        this.handleBackendErrors(error);
        this.formType = 'register';
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout Response:', response); // Log the success response
        this.isLoggedIn = false;  // Update the state after logout
        this.message = 'You have been logged out.';
        this.messageType = 'success';
        localStorage.removeItem('username'); // Clear the stored username on logout

        // Clear the login form after logout
        this.clearLoginForm();
      },
      (error) => {
        console.error('Logout Error:', error); // Log the error response
        this.message = error; // Display the error message from the backend
        this.messageType = 'error';
      }
    );
  }

  private handleBackendErrors(error: any) {
    if (typeof error === 'object' && error !== null) {
      this.validationErrors = error;
      this.message = 'There were validation errors.';
    } else {
      this.message = error;
    }
    this.messageType = 'error';
  }

  // Method to clear only the password field after login
  private clearPasswordField() {
    this.loginData.password = '';
  }

  // Method to clear the login form after logout
  private clearLoginForm() {
    this.loginData.username = '';
    this.loginData.password = '';
  }

  // Method to clear the registration form
  private clearRegisterForm() {
    this.registerData.username = '';
    this.registerData.email = '';
    this.registerData.password = '';
  }
}
