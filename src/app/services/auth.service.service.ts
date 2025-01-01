import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private _http:HttpClient) { }

  authURL = 'http://localhost:3000/users/login';

    login(loginData:any):Observable <any>{
      return this._http.post(this.authURL,loginData).pipe(tap((res:any)=>{
        localStorage.setItem('token',res.token);
      }));
    }

    logout(){
      localStorage.removeItem('token');
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
