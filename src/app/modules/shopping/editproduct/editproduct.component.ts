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
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent implements OnInit {

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  editUid:any;
  public Editor=ClassicEditor
  selectedFile:any;
  selectedFileName=null;
  categories =[] as any;
  brands =[] as any;
  product =[] as any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  constructor(private http:HttpClient,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { }
  loading = true;
  back(){
    this.router.navigate(['/shopping/product']);
  }
  
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
      this.editProduct.reset();
    }
    this.service.apiPost('PBrand',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.brands = result.brands;
      }
    })
    this.service.apiPost('PCategory',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.categories = result.categories;
      }
    })
    this.service.apiPost('Product',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,'product_id':this.editUid})
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.product = result.product;
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          this.editProduct.patchValue({
            product_title:result.product.product_title,
            brand:result.product.brand_id,
            category:result.product.category_id,
            price:result.product.compare_price,
            sku:result.product.sku,
            model:result.product.model,
            status:result.product.status,
            availability:result.product.availability,
            stock:result.product.stock,
            unit_type:result.product.unit_type,
            descriptions:result.product.descriptions,
            quick_overview:result.product.quick_overview,
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
  editProduct=this.fb.group({
    product_title:[''],
    brand:[''],
    category:[''],
    price:[''],
    sku:[''],
    model:[''],
    status:[''],
    availability:[''],
    stock:[''],
    unit_type:[''],
    descriptions:[''],
    quick_overview:[''],
  })
  onSubmit(data:any){
    var formData=new FormData();
    formData.append('uid',this.uId)
    formData.append('product_id',this.editUid)
    formData.append('profile_id',this.cProfile)
    formData.append('org_uid',this.orgId)
    if(data.product_title!=null){ formData.append('product_title',data.product_title) }
    if(data.brand!=null){ formData.append('brand',data.brand) }
    if(data.category!=null){ formData.append('category',data.category) }
    if(data.price!=null){ formData.append('price',data.price) }
    if(data.sku!=null){ formData.append('sku',data.sku) }
    if(data.model!=null){ formData.append('model',data.model) }
    if(data.status!=null){ formData.append('status',data.status) }
    if(data.availability!=null){ formData.append('availability',data.availability) }
    if(data.stock!=null){ formData.append('stock',data.stock) }
    if(data.unit_type!=null){ formData.append('unit_type',data.unit_type) }
    if(data.descriptions!=null){ formData.append('descriptions',data.descriptions) }
    if(data.quick_overview!=null){ formData.append('quick_overview',data.quick_overview) }
    formData.append('product_image',this.selectedFile)
    this.http.post<any>(this.url + '/crm/addEditProduct', formData,this.service.getUploadMulitpleImages()).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          this.router.navigate(['crm/product']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }

}
