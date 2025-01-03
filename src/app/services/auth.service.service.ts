import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private _http:HttpClient) { 
    const token = localStorage.getItem('accessToken');
    if(token){
      this.tokenSubject.next(token);
    }
  }

  authURL = 'http://localhost:3000/users/login';


    private tokenSubject: BehaviorSubject<string |null> = new BehaviorSubject<string |null>(null);

    login(loginData:any):Observable <any>{
      return this._http.post(this.authURL,loginData).pipe(tap((res:any)=>{
        const token = res.token;
        if(token){
          localStorage.setItem('accessToken',token);
          this.tokenSubject.next(token);
        }
      }));
    }

    getAccessToken():Observable<string |null>{
      return this.tokenSubject.asObservable();
    }

    logout(){
      this.tokenSubject.next(null);
      localStorage.removeItem('accessToken');
    }

    isAuthanticated():boolean{
      return this.tokenSubject.value !== null; 
    }

    decodeAccessToken():any{
      const token = this.tokenSubject.value;
      if(token){
        return jwtDecode<any>(token);
      }
      return null;
    }

    getToken(){
      return localStorage.getItem('token');
    } 

    isLoggedIn(){
      let token = localStorage.getItem('token');
      if(token){
        return true;
      }
      else{
        return false;
      }
    }

    register(registerData:any):Observable<any>{
      return this._http.post('http://localhost:3000/users/', registerData).pipe(
        tap((res: any) => {
          localStorage.setItem('token', res.token);
        })
      );
    }
  
}
