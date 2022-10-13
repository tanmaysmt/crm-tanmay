import { Component,AfterViewInit, OnInit ,ViewChild } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
declare var toastr:any;
declare var Swal:any;
declare var $:any;

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements AfterViewInit {

  pipe:any;
  loading=true;
  shownocard :any;
  routerLink='/crm/leads';
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  categories = [] as any;
  dataSource = [] as  any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  
  constructor(private http:HttpClient,private _liveAnnouncer: LiveAnnouncer,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    this.pipe = new DatePipe('en-IL');
    const defaultPredicate=this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data:any, filter:any) =>{
      const formatted=this.pipe.transform(data.created_at,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
  }
  back(){
    this.router.navigate(['crm/brands']);
  }
  displayedColumns: string[] = ['brand_image', 'brand_title', 'status', 'created_at','id'];
  ngAfterViewInit() {
    this.loading = true;
    this.service.apiPost('PBrand',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.dataSource = new MatTableDataSource<CategoryElement>(result.brands);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(result.brands.length>0){
          this.shownocard = false;
        }else{
          this.shownocard = true;
        }
      }
    })
  }
  range=this.fb.group({
    start: [''],
    end: ['']
  });
  announceSortChange(sortState:any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  applyFilter(filterValue:any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }
  dateFil() {
    this.dataSource.filter = ''+Math.random();
  }
  getDateRange(value:any) {
    const fromDate = this.pipe.transform(value.start,'yyyy/MM/dd');
    const toDate = this.pipe.transform(value.end,'yyyy/MM/dd/');
    this.loading = true;
    if(fromDate !== '' && toDate !== '') {
      this.loading = true;
      this.service.apiPost('PBrand',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,"start":fromDate,"end":toDate})
      .subscribe(result  => {
        if(result){
          this.loading = false;
          this.dataSource = new MatTableDataSource<CategoryElement>(result.brands);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
    }
  }
  Unpublish(id:any){
    this.service.apiPost('unpublishOpportunity',{'id':id}).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          this.service.apiPost('PBrand',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
          .subscribe(result  => {
            if(result){
              this.loading = false;
              this.dataSource = new MatTableDataSource<CategoryElement>(result.brands);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          })
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
  ConfirmAlert = function (this:any,lead_id:any){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success m-2',
            cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result:any) => {
        if (result.value == true) {
            swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )    
            this.Unpublish(lead_id)
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    })
  }
}
export interface CategoryElement {
  brnad_image: string;
  brand_title: string;
  status: string;
  created_at: Date;
  id: number;
}