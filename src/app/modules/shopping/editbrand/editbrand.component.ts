import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import {  Location } from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-editbrand',
  templateUrl: './editbrand.component.html',
  styleUrls: ['./editbrand.component.css']
})
export class EditbrandComponent implements OnInit {

  

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  editUid:any;
  public Editor=ClassicEditor
  selectedFile:any;
  selectedFileName=null;
  categories =[] as any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  constructor(private http:HttpClient,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { }
  loading = true;
  back(){
    this.router.navigate(['/shopping/brands']);
  }
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
      this.editBrand.reset();
    }
    this.service.apiPost('PBrand',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,'brand_id':this.editUid})
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.categories = result.categories;
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          this.editBrand.patchValue({
            CategoryTitle : result.brand.brand_title,
            BrandDescription : result.brand.description,
            BrandStatus : result.brand.status,
          })
        }
      }
    })
  }
  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
  }
  onfileselected(event:any){
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
  }
  editBrand=this.fb.group({
    CategoryTitle:[''],
    BrandDescription:[''],
    BrandStatus:['']
  })
  onSubmit(data:any){
    var formData=new FormData();
    formData.append('uid',this.uId)
    formData.append('brand_id',this.editUid)
    formData.append('profile_id',this.cProfile)
    formData.append('org_uid',this.orgId)
    formData.append('brand_image',this.selectedFile)
    if(data.CategoryTitle!=null){
      formData.append('brand_title',data.CategoryTitle);
    }
    if(data.BrandDescription!=null){
      formData.append('description',data.BrandDescription);
    }
    if(data.BrandStatus!=null){
      formData.append('status',data.BrandStatus);
    }
    this.http.post<any>(this.url + '/crm/editPBrand', formData,this.service.getUploadMulitpleImages()).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          this.router.navigate(['crm/brands']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
}
