import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { DepartmentsComponent } from './departments/departments.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'app',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'address-book', component: AddressBookComponent },
            { path: 'jobs', component: JobsComponent },
            { path: 'departments', component: DepartmentsComponent },
            { path: '', redirectTo: 'address-book', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
