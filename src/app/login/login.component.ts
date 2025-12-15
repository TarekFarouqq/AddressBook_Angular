import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.authService.login(this.loginForm.value).subscribe({
                next: (res: any) => {
                    if (res && res.token) {
                        try {
                            const decoded = jwtDecode(res.token);

                            this.authService.storeToken(res.token);
                            this.toastr.success('Logged in successfully');
                            this.router.navigate(['/app/address-book']);
                        } catch (e) {

                            this.toastr.error('Invalid credentials');
                        }
                    } else {
                        this.toastr.error('Login failed: No token received');
                        this.isLoading = false;
                    }
                },
                error: (err) => {
                    this.toastr.error('Login failed: ' + (err.error?.message || err.message));
                    this.isLoading = false;
                }
            });
        } else {
            this.toastr.error('Please enter valid credentials');
        }
    }
}
