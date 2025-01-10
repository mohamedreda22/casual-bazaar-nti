import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap,map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  authURL = 'http://localhost:3000/users/login';

  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private userStateSubject: BehaviorSubject<{
    isAuthenticated: boolean;
    isAdmin: boolean;
  }> = new BehaviorSubject<{ isAuthenticated: boolean; isAdmin: boolean }>({
    isAuthenticated: false,
    isAdmin: false,
  });

  constructor(private _http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.tokenSubject.next(token);
      this.decodeAndSetUserState(token);
    }
  }

  login(loginData: any): Observable<any> {
    return this._http.post(this.authURL, loginData).pipe(
      tap((res: any) => {
        const token = res.token;
        if (token) {
          localStorage.setItem('accessToken', token);
          this.tokenSubject.next(token);
          this.decodeAndSetUserState(token); // Set the authentication state and user role
        }
      })
    );
  }

  private decodeAndSetUserState(token: string): void {
    try {
      const decodedToken = jwtDecode<any>(token);
      const isAuthenticated = !!decodedToken;
      const isAdmin = decodedToken?.userType === 'Admin';

      this.userStateSubject.next({ isAuthenticated, isAdmin });
    } catch (error) {
      console.error('Token decoding failed:', error);
      this.userStateSubject.next({ isAuthenticated: false, isAdmin: false });
    }
  }

  getAccessToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  decodeAccessToken(): any {
    const token = this.tokenSubject.value;
    if (token) {
      return jwtDecode<any>(token);
    }
    return null;
  }

  logout(): void {
    this.tokenSubject.next(null);
    localStorage.removeItem('accessToken');
    this.userStateSubject.next({ isAuthenticated: false, isAdmin: false });
  }

  // Modified to return only the boolean value for isAuthenticated
  isAuthenticated(): Observable<boolean> {
    return this.userStateSubject.asObservable().pipe(
      tap((state) => {/* console.log('Authenticated:', state.isAuthenticated) */}),
      map((state) => state.isAuthenticated) // Extract the boolean value
    );
  }

  // Modified to return only the boolean value for isAdmin
  isAdmin(): Observable<boolean> {
    return this.userStateSubject.asObservable().pipe(
      tap((state) => {/* console.log('Is Admin:', state.isAdmin) */}),
      map((state) => state.isAdmin) // Extract the boolean value
    );
  }

  getUserId(): string {
    const token = this.tokenSubject.value;
    if (token) {
      const decodedToken = jwtDecode<any>(token);
      return decodedToken?.userId || '';
    }
    return '';
  }

  register(registerData: any): Observable<any> {
    return this._http.post('http://localhost:3000/users/', registerData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.tokenSubject.next(res.token);
        this.decodeAndSetUserState(res.token);
      })
    );
  }
}
