import { Component } from '@angular/core';
import { AuthServiceService } from '../services/auth.service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false, 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent {
  constructor(private _authS: AuthServiceService, private _router: Router) {}

  login(loginForm: any): void {
    // Accept form data from the template
    if (loginForm.valid) {
      this._authS.login(loginForm.value).subscribe({
        next: (res) => {
          // console.log('response: ', res);
          this._authS.isAdmin().subscribe((isAdmin) => {
            if (isAdmin === true) {
              this._router.navigate(['/admin-dashboard']);
            } else {
              this._router.navigate(['/home']);
            }
          });
        },
        error: (err) => {
          console.error('Error logging in:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Invalid username or password',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid username and password',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }
}
