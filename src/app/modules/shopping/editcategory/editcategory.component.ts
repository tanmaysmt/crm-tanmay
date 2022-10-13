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
  selector: 'app-editcategory',
  templateUrl: './editcategory.component.html',
  styleUrls: ['./editcategory.component.css']
})
export class EditcategoryComponent implements OnInit {

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  editUid:any;
  loading=true;
  public Editor=ClassicEditor
  Edata:any;
  selectedFile:any;
  selectedFileName=null;
  categories =[] as any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  constructor(private http:HttpClient,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
  }
  back(){
    this.router.navigate(['/shopping/category']);
  }
  
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
      this.editCategory.reset();
    }
    this.service.apiPost('PCategory',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,'category_id':this.editUid})
    .subscribe(result  => {
      if(result){
        this.loading=false;
        this.categories = result.categories;
        this.Edata = result.category.description;
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          this.editCategory.patchValue({
            CategoryTitle : result.category.category_title,
            ParentCategory : result.category.parent_id,
            CategoryDescription : result.category.description,
            CategoryStatus : result.category.status
          })
        }
      }
    })
  }
  public onChange( { editor }: ChangeEvent ) {
    this.Edata = editor.getData();
  }
  onfileselected(event:any){
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
  }
  editCategory=this.fb.group({
    CategoryTitle:[''],
    ParentCategory:[''],
    CategoryDescription:[''],
    CategoryStatus:['']
  })
  onCategorySubmit(data:any){
    var formData=new FormData();
    formData.append('uid',this.uId)
    formData.append('category_id',this.editUid)
    formData.append('profile_id',this.cProfile)
    formData.append('org_uid',this.orgId)
    formData.append('category_image',this.selectedFile)
    if(data.CategoryTitle!=null){
      formData.append('category_title',data.CategoryTitle);
    }
    if(data.CategoryDescription!=null){
      formData.append('CategoryDescription',data.CategoryDescription);
    }
    if(data.ParentCategory!=null){
      formData.append('ParentCategory',data.ParentCategory);
    }
    if(data.CategoryStatus==null){
      formData.append('CategoryStatus','1');
    }else{
      formData.append('CategoryStatus',data.CategoryStatus);
    }
    this.http.post<any>(this.url + '/crm/editPCategory', formData,this.service.getUploadMulitpleImages()).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          this.router.navigate(['crm/category']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }

}
