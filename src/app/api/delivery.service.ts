import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
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

    //https://official.keefob.com/aws/rest/file/queryReasonVisit
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

  getUnitEntity(centity: any): Observable<any>{
    let userData = localStorage.getItem("outh2_token");    
    let httpHeaders = new HttpHeaders();
    //httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userData);

    httpHeaders.set('Content-Type', 'multipart/form-data');

    var formdata = new FormData();
    formdata.append("cunitentity", "0");
    formdata.append("ccompany",   "1");
    formdata.append("centity", centity);
    formdata.append("state", "A");

    
    //return this.http.get<any>(this.API_CATALOG_URL + `/UnitEntity/findByCentity/${centity}`,  {headers: httpHeaders});
    return this.http.post<any>(this.API_REGISTER_URL + `/queryUnitEntity`, formdata ,  {headers: httpHeaders});
  }

  getReasonsVisit(): Observable<any>{
    let userData = localStorage.getItem("outh2_token");    
    let httpHeaders = new HttpHeaders();
    //httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userData);
    httpHeaders.set('Content-Type', 'multipart/form-data');

    var formdata = new FormData();
    formdata.append("creasonVisit", "0");
    formdata.append("ccompany",   "1"); 
    formdata.append("state", "A");

    //return this.http.get<any>(this.API_CATALOG_URL + `/reasons_visit`,  {headers: httpHeaders});
    return this.http.post<any>(this.API_REGISTER_URL + `/queryReasonVisit`, formdata, {headers: httpHeaders});
  }


  getVisitLogByPhoneNumber(phoneNumber: string): Observable<any>{
    let userData = localStorage.getItem("outh2_token");    
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userData);
    
    return this.http.get<any>(this.API_CATALOG_URL + `/visit_log/search/findByPhone?phone=${phoneNumber}`,  {headers: httpHeaders});
  }

  registerVisit(
    id_visit_log,
    resident_name,
    resident_lastname,
    resident_email,
    id_reason_visit,
    cunit_entity,
    visitor_mobile_phone_number,
    visitor_name,
    visitor_lastname,
    visitor_email,
    file1,fileName1,
    file2,fileName2,
    observation_reason_visit
    ): Observable<any> {

      const httpHeaders = new HttpHeaders();
      httpHeaders.set('Content-Type', 'multipart/form-data');

    var formdata = new FormData();
    if(fileName1){
      formdata.append("file", file1, fileName1);
    }
    if(fileName2){
      formdata.append("fileb", file2, fileName2);
    }  
    
    formdata.append("id_visit_log", id_visit_log);
    formdata.append("ccompany", "1");
    formdata.append("resident_name", resident_name);
    formdata.append("resident_lastname", resident_lastname);
    formdata.append("id_reason_visit", id_reason_visit);
    formdata.append("cunit_entity", cunit_entity);
    formdata.append("visitor_mobile_phone_number", visitor_mobile_phone_number);
    formdata.append("visitor_name", visitor_name);
    formdata.append("visitor_lastname", visitor_lastname);
    formdata.append("visitor_email", visitor_email);
    formdata.append("resident_email", resident_email);
    formdata.append("observation_reason_visit", observation_reason_visit);
    formdata.append("state", "A");
    formdata.append("cestatus", "0");

    

    return this.http.post<any>(this.API_REGISTER_URL + `/visit_log`, formdata, {headers: httpHeaders});
  }

  
  
}

