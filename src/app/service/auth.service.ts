import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private service:any = undefined;
  setPermissipon(data:any){
     this.service = data;
  }
  getPermission(){
    return this.service;
  }
  getAuthHeaderOption() {
    let token = localStorage.getItem('token')
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' +token)
    .set('Content-Type', 'application/json')  
    .set('Accept', 'application/json')
    .set('Accept-Language', 'en_US');
    let option = { headers: headers };
    return option
  }
  getUploadMulitpleImages() {
    let token = localStorage.getItem('token')
    let headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' +token)
    let option = { headers: headers };
    return option
  }
  url = CommonService.API_ENDPOINT;
  url2 = CommonService.API_ENDPOINT2;
  authurl = CommonService.AUTH_API_ENDPOINT;
  constructor(private http : HttpClient,private router:Router) { }
  login(userData:any){
    return this.http.post<any>(this.url+'/login',userData,this.getAuthHeaderOption());
  }
  isAuthenticated = function () {
    var id = localStorage.getItem('Id')
    var token = localStorage.getItem('token')
    var uid = localStorage.getItem('uId')
    var org_uid = localStorage.getItem('org_uid')
    var acId = localStorage.getItem('acId')
    var cProfile = localStorage.getItem('cProfile')
    if(id && token && uid && org_uid && acId && cProfile){
      return  true;
    }
    return  false;
  }
  packages(path:any){
    return this.http.get<any>(this.url+'/Packages',this.getAuthHeaderOption());
  }
  register(userData:any){
    return this.http.post<any>(this.url+'/register',userData,this.getAuthHeaderOption());
  }
  verifyotp(userData:any){
    return this.http.post<any>(this.url+'/verifyotp',userData,this.getAuthHeaderOption());
  }
  resendotp(userData:any){
    return this.http.post<any>(this.url+'/resendotp',userData,this.getAuthHeaderOption());
  }
  checkinvitation(userData:any){
    return this.http.post<any>(this.url+'/checkInvitationUnique',userData,this.getAuthHeaderOption());
  }
  forgotPassword(userData:any){
    return this.http.post<any>(this.url+'/forgotPassword',userData,this.getAuthHeaderOption());
  }
  resetPassword(userData:any){
    return this.http.post<any>(this.url+'/resetPassword',userData,this.getAuthHeaderOption());
  }
  checkPasswordToken(userData:any){
    return this.http.post<any>(this.url+'/checkPasswordToken',userData,this.getAuthHeaderOption());
  }
  getUser(userData:any){
    return this.http.post<any>(this.url+'/crm/getUser',userData,this.getAuthHeaderOption());
  }
  apiPost(path:any,param:any) {
    return this.http.post<any>(this.authurl + path, param, this.getAuthHeaderOption());
  }
  apiGet(path:any) {
    return this.http.get(this.authurl + path, this.getAuthHeaderOption());
  }
  completeAccount(userData:any){
    return this.http.post<any>(this.url+'/crm/CompleteAccount', userData, this.getUploadMulitpleImages());
  }
  getPermissions(){
    return this.http.post<any>(this.url2+'getPermissions',{'account_id':localStorage.getItem('acId')}, this.getUploadMulitpleImages());
  }
  postRequest(path:any,param:any){
    return this.http.post<any>(this.url2 + path, param, this.getAuthHeaderOption());
  }
  getRequest(path:any){
    return this.http.get(this.url2 + path, this.getAuthHeaderOption());
  }
  logOut() {
    sessionStorage.clear();
    localStorage.removeItem('Id');
    localStorage.removeItem('token');
    localStorage.removeItem('uId');
    localStorage.removeItem('org_uid');
    localStorage.removeItem('cProfile');
    localStorage.removeItem('permissions');
  }
  storeWebToken(result:any){
    localStorage.removeItem('Id');
    localStorage.removeItem('token');
    localStorage.removeItem('uId');
    localStorage.removeItem('org_uid');
    localStorage.removeItem('acId');
    localStorage.removeItem('cProfile');
    localStorage.removeItem('permissions');
    localStorage.setItem('Id', result.id);
    localStorage.setItem('token',result.token);
    localStorage.setItem('uId',result.uid);
    localStorage.setItem('org_uid',result.org_uid);
    localStorage.setItem('acId',result.acId);
    localStorage.setItem('cProfile',result.cProfile);
    localStorage.setItem('permissions',result.permissions);
  }
}
