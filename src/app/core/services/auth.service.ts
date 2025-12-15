import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = `${environment.apiLocalBaseUrl}/Auth`;

    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, credentials);
    }

    storeToken(token: string) {
        localStorage.setItem('authToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    logout() {
        localStorage.removeItem('authToken');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
