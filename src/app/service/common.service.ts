import { ArrayType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AuthGuard } from '../guard/auth.guard';
import { AuthService } from './auth.service';

function _window(): any{
  return window;
}
declare var $:any;
@Injectable({
  providedIn: 'root'
})
export class CommonService {
 
  /* public static API_ENDPOINT='http://127.0.0.1:8000/api'; 
  public static AUTH_API_ENDPOINT='http://127.0.0.1:8000/api/crm/'; 
  public static SRC_API_ENDPOINT='http://127.0.0.1:8000/uploads/';
  public static API_ENDPOINT2='http://127.0.0.1:3000/'; */

  public static RAZORPAY_KEY_ID = 'rzp_test_iijGgC2DfISWDR';
  public static RAZORPAY_KEY_SECRET = 'vIqhRkI5wqwIq8CjhzFBMW5g';
  
  get nativeWindow() :any {
    return _window();
  }

  // public static API_ENDPOINT='http://3.110.156.124/admin/public/api';
  // public static AUTH_API_ENDPOINT='http://3.110.156.124/admin/public/api/crm/';
  // public static SRC_API_ENDPOINT='http://3.110.156.124/admin/public/uploads/';
  // public static API_ENDPOINT2='http://3.110.156.124:3000/';

  public static API_ENDPOINT='https://admin.flylight.in/api';
  public static AUTH_API_ENDPOINT='https://admin.flylight.in/api/crm/';
  public static SRC_API_ENDPOINT='https://admin.flylight.in/public/uploads/';
  public static API_ENDPOINT2='https://api.flylight.in/';

  uId:any = localStorage.getItem('uId');
  constructor(private service:AuthService) {}

  loadScripts(dynamicScripts:any) {
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.id = dynamicScripts[i];
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.body.appendChild(node);
    }
  }

  loadCss(dynamicCss:any) {
    for (let i = 0; i < dynamicCss.length; i++) {
      const head = document.getElementsByTagName('head')[0];
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.id = dynamicCss[i];
      style.href = dynamicCss[i];
      head.appendChild(style);
    }
  }
  removeScripts(dynamicCss:string[]){
    for (let i = 0; i < dynamicCss.length; i++) {
      document.getElementById(dynamicCss[i])?.remove();
    }
  }
  removeCSS(dynamicCss:string[]){
    for (let i = 0; i < dynamicCss.length; i++) {
      document.getElementById(dynamicCss[i])?.remove();
    }
  }
  downloadFile(data:any,column:any) {
    let filename='data';
    let csvData = this.ConvertToCSV(data,column);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(objArray:any, headerList:any) {
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = 'S.No,';

     for (let index in headerList) {
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i+1)+'';
         for (let index in headerList) {
            let head = headerList[index];

             line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
  }
}
