import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthServiceService } from '../services/auth.service.service';
import { PasswordValidator } from '../customvalidators/password.validator';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(private _authS: AuthServiceService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        PasswordValidator.passwordStrength(),
      ]),
      retypepassword: new FormControl(null, [
        Validators.required,
        PasswordValidator.passwordMatch('password', 'retypepassword'),
      ]),
    });
  }

  registerForm!: FormGroup;

  passwordMismatch() {
    const password = this.registerForm.get('password')?.value;
    const retypepassword = this.registerForm.get('retypepassword')?.value;
    return password !== retypepassword;
  }

  register(registerForm: FormGroup) {
    this._authS.register(registerForm.value).subscribe(
      (res) => {
        console.log(res);
        // Redirect to login path on success
        window.location.href = '/login';
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
