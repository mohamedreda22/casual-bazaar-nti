import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../services/auth.service.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private _authS: AuthServiceService) {}

  register(registerForm: NgForm) {
    this._authS.register(registerForm.value).subscribe((res) => {
      console.log(res);
    });
  }
}
