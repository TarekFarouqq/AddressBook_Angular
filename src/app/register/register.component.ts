import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private authService: AuthService
    ) {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            userName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.required],
            address: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            const payload = this.registerForm.value;
            this.authService.register(payload).subscribe({
                next: (res) => {
                    this.toastr.success('Registration successful. Please login.');
                    this.router.navigate(['/login']);
                    this.isLoading = false;
                },
                error: (err) => {
                    this.toastr.error('Registration failed: ' + (err.error?.message || err.message));
                    this.isLoading = false;
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
            this.toastr.error('Please fix the errors in the form');
        }
    }
}
