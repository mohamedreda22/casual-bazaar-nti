import { Component } from '@angular/core';
import { AuthServiceService } from '../services/auth.service.service';
import { Router } from '@angular/router';

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
          console.log('response: ', res);
          this._authS.isAdmin().subscribe((isAdmin) => {
            if (isAdmin === true) {
              this._router.navigate(['/admin-dashboard']);
            } else {
              this._router.navigate(['/home']);
            }
          });
        },
        error: (err) => {
          console.log('error: ', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
