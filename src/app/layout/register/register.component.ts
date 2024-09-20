import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  constructor(private _supabase: SupabaseService, private _router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        pwd: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        pwd2: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('pwd')?.value;
    const confirmPassword = control.get('pwd2')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  register() {
    const { email, pwd, pwd2 } = this.form.value;

    if (pwd === pwd2) {
      this._supabase.signUpWithEmail(email, pwd).then((res) => {
        res.error
          // ? this._toastService.error(res.error.message)
          ? alert(res.error.message)
          : this.registerUserOnTable(email, String(res.data.user?.id));
      });
    }
  }

  registerUserOnTable(email: string, id: string) {
    this._router.navigate(['/dashboard']);
    this._supabase.registerUserOnTable(email, id);
  }
}
