import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
    sidebarOpen = false;

    constructor(private authService: AuthService, private router: Router) { }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
