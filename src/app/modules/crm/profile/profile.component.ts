import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  Profileuid = this.route.snapshot.paramMap.get('id');
  Profileid = this.route.snapshot.paramMap.get('profile_id');
  ProfileorgId = this.route.snapshot.paramMap.get('orgId');
  public user:any;
  loading = true;
  editUid:any;
  public first_name:any;
  public last_name:any;
  public city:any;
  public country:any;
  public designation:any;
  public organization:any;
  public profileType = [] as any;
  selectedFile:any;
  selectedFileName =null;
  uid = this.route.snapshot.paramMap.get('id');
  constructor(private router:Router,private service : AuthService,private http:HttpClient,private route:ActivatedRoute,public common:CommonService) {
  }
  imageSrc:any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  ngOnInit(): void {
    if(this.uid!==null){
      this.service.apiPost('getUserInfo',{"uid":this.Profileuid,"org_uid":this.ProfileorgId,'profile_id':this.Profileid})
      .subscribe(result => {
          if(result){
            this.designation = result.data.role.name;
            this.organization = result.data.orgaz.name;
            this.profileType = result.data.profiletype;
          }
      })
      this.editUid=this.route.snapshot.paramMap.get('id');
      this.service.apiPost('getUser',{"userId":this.uid})
      .subscribe(result => {
        if(result){
          this.loading = false;
          this.imageSrc = this.srcUrl+'avatar/'+result.data.avatar;
          if(result.data.avatar===null){
            this.imageSrc = this.srcUrl+'avatar/avatar.png';
          }
          this.city = result.data.city;
          this.country= result.data.country;
          this.first_name = result.data.first_name;
          this.Accountprofile.patchValue({
            first_name : result.data.first_name,
            last_name : result.data.last_name,
            email : result.data.email,
            phone : result.data.phone,
            dob : result.data.dob,
            street : result.data.street,
            city : result.data.city,
            state : result.data.state,
            zip : result.data.zip,
            country : result.data.country,
          })
        }
      })
    }else{
      this.loading = false;
    }
  }
  onfileselected(event:any){
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = event => this.imageSrc = reader.result;
    reader.readAsDataURL(this.selectedFile);
    var formData=new FormData();
    formData.append('uid',this.editUid)
    formData.append('userAvatar',this.selectedFile)
    this.http.post<any>(this.url + '/crm/updateAvatar', formData,this.service.getUploadMulitpleImages())
    .subscribe(response => {
      if(response.status=='success'){
        toastr.success(response.message);
      }else{
        toastr.error(response.message);
      }
    },error =>{
      toastr.error(error);
    })
  }
  Accountprofile = new FormGroup({
    userAvatar : new FormControl(''),
    first_name : new FormControl(''),
    last_name : new FormControl(''),
    email : new FormControl(''),
    phone : new FormControl(''),
    dob : new FormControl(''),
    street : new FormControl(''),
    city : new FormControl(''),
    state : new FormControl(''),
    zip : new FormControl(''),
    country : new FormControl(''),
  })
  onSubmit(data:any){
    data.uid=this.editUid;
    data.org_uid=this.orgId;
    var token = localStorage.getItem('token');
    this.service.completeAccount(data).subscribe(
      response => {
        if(response.status=='success'){
          this.editUid=this.route.snapshot.paramMap.get('id');
          this.service.apiPost('getUser',{"userId":this.uid})
          .subscribe(result => {
            if(result){
              this.loading = false;
              this.imageSrc = this.srcUrl+result.data[0].avatar;
              if(result.data[0].avatar===null){
                this.imageSrc = this.srcUrl+'avatar.png';
              }
              this.city = result.data[0].city;
              this.country= result.data[0].country;
              this.first_name = result.data[0].first_name;
              this.Accountprofile.patchValue({
                first_name : result.data[0].first_name,
                last_name : result.data[0].last_name,
                email : result.data[0].email,
                phone : result.data[0].phone,
                dob : result.data[0].dob,
                street : result.data[0].street,
                city : result.data[0].city,
                state : result.data[0].state,
                zip : result.data[0].zip,
                country : result.data[0].country,
              })
            }
          })
          toastr.success(response.message);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
}
