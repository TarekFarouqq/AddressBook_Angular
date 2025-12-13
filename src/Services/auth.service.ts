import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../enviroments/enviroment';
import { TokenStorageService } from './token-storage.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({providedIn: 'root'})
export class AuthService {

  private currentUserSub: BehaviorSubject<any>;
  currentUser$: any;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {
    this.currentUserSub = new BehaviorSubject<any>(this.tokenStorage.getUser());
    this.currentUser$ = this.currentUserSub.asObservable();
  }

  login(username: string, password: string) {
    const url = `${environment.apiLocalBaseUrl}/Auth/login`;
    return this.http.post<{ token: string }>(url, { username, password }).pipe(
      map(resp => {
        const token = (resp as any).token;
        this.tokenStorage.saveToken(token);
        
          const decoded = jwtDecode(token);
          this.tokenStorage.saveUser(decoded);
          this.currentUserSub.next(decoded);
        
        return resp;
      })
    );
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.currentUserSub.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}
