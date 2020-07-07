import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  API : string;

  API_AUTH_URL : string;

  API_CATALOG_URL : string;

  API_DOMAIN: string = 'official.keefob.com';

  API_2 : string;
  API_REGISTER_URL : string;

  constructor(private http: HttpClient) { 
    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.hostname;
        
    //this.API = "http://"+baseUrl+":5000/";

    this.API = `http://${this.API_DOMAIN}:8090/`;

    this.API_2 = `https://${this.API_DOMAIN}/`;

    this.API_AUTH_URL = this.API + 'api/security/oauth';

    this.API_CATALOG_URL = this.API + 'api/usuarios';

    this.API_REGISTER_URL = this.API_2 + 'aws/rest/file';

  }

  // Authentication/Authorization
  getToken(clientId: string, clientSecret: string ,
      username: string, password: string): Observable<any> {

    let userData = window.btoa(clientId + ':' + clientSecret);
    let httpHeaders = new HttpHeaders();

    httpHeaders = httpHeaders.set('Authorization', 'Basic ' + userData)
    .set('Content-Type', 'application/x-www-form-urlencoded');

    let body = "username=" + username + "&password=" + password+"&grant_type=password";

    return this.http.post<any>(this.API_AUTH_URL + '/token', body, {headers: httpHeaders});
  }

  getUnitEntity(centity: number): Observable<any>{
    let userData = localStorage.getItem("outh2_token");    
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userData);
    
    return this.http.get<any>(this.API_CATALOG_URL + `/UnitEntity/findByCentity/${centity}`,  {headers: httpHeaders});
  }

  getReasonsVisit(): Observable<any>{
    let userData = localStorage.getItem("outh2_token");    
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userData);
    
    return this.http.get<any>(this.API_CATALOG_URL + `/reasons_visit`,  {headers: httpHeaders});
  }


  getVisitLogByPhoneNumber(phoneNumber: string): Observable<any>{
    let userData = localStorage.getItem("outh2_token");    
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userData);
    
    return this.http.get<any>(this.API_CATALOG_URL + `/visit_log/search/findByPhone?phone=${phoneNumber}`,  {headers: httpHeaders});
  }

  registerVisit(user: any): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<any>(this.API_REGISTER_URL + `/visit_log`, user, {headers: httpHeaders});
  }
  
}

