import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../services/auth.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private _authS:AuthServiceService,private _router: Router) {}

  login(loginForm: NgForm) {
    this._authS.login(loginForm.value).subscribe({
      next: (res) => {
        this._router.navigate(['/admin-dashboard']); 
        console.log(this._authS.decodeAccessToken());
      },
      error: (err) => {
        console.log("error: ",err);
      },

    });
    console.log(loginForm.value);
  }


}
