import { Component, OnInit } from '@angular/core';
import { FormBuilder ,Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  receiveUserInfo($event:any) {
    if($event){
      this.first_name = $event.data.user.first_name
      this.last_name = $event.data.user.last_name
      this.imageSrc = this.srcUrl+'avatar/'+$event.data.user.avatar;
      this.city = $event.data.user.city;
      this.country = $event.data.user.country
      this.profileType = $event.data.profiletype;
      this.designation = $event.data.role;/* orgaz */
      this.organization = $event.data.orgaz;/* orgaz */
      if($event.data.user.avatar===null){
        this.imageSrc = this.srcUrl+'/avatar/avatar.png';
      }
      this.completeAccount.patchValue({
        first_name : $event.data.user.first_name,
        last_name : $event.data.user.last_name,
        email : $event.data.user.email,
        phone : $event.data.user.phone,
        dob : $event.data.user.dob,
        street : $event.data.user.street,
        city : $event.data.user.city,
        state : $event.data.user.state,
        zip : $event.data.user.zip,
        country : $event.data.user.country,
      })
    }
  }
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');

  Scripts = [
    "assets/plugins/flatpickr/flatpickr.min.js",
    "assets/js/datetime.js",
  ];
  Css = [
    "assets/plugins/flatpickr/flatpickr.min.css"
  ]
  public user:any;
  loading = false;
  constructor(private router:Router,private service : AuthService,private http:HttpClient,public common : CommonService,private fb:FormBuilder) { 
    this.common.loadScripts(this.Scripts);
    this.common.loadCss(this.Css);
  }
  public userId = localStorage.getItem('Id');
  public first_name:any;
  public last_name:any;
  public city:any;
  public country:any;
  public data:any;
  public avatar:any;
  selectedFile:any;
  selectedFileName=null;
  imageSrc:any;
  organization= [] as any;
  profileType = [] as any;
  designation= [] as any;/* orgaz */
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  ngOnInit(): void {
    
  }
  ChangePassword = this.fb.group({
    NewPassword : ['',Validators.required],
    ConfirmPassword : ['',Validators.required],
  })
  onPassSubmit(data:any){
    data.uid = this.uId;
    if(data.NewPassword !== data.ConfirmPassword){
      toastr.error('Both Password do not match!');
    }else{
      this.service.apiPost('changePassword',data).subscribe(
        response => {
          if(response.status=='success'){
            toastr.success(response.message);
            $("#modal-default").modal("hide");
            this.ChangePassword.reset();
          }
        }
      );
    }
  }
  completeAccount = this.fb.group({
    userAvatar : ['',Validators.required],
    first_name : [''],
    last_name : [''],
    email : [''],
    phone : [''],
    dob : [''],
    street : [''],
    city : [''],
    state : [''],
    zip : [''],
    country : [''],
  })
  onfileselected(event:any){
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = event => this.imageSrc = reader.result;
    reader.readAsDataURL(this.selectedFile);
    var formData=new FormData();
    formData.append('uid',this.uId)
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
  onSubmit(data:any){
    this.loading = true;
    data.uid=this.uId;
    data.org_uid=this.orgId;
    this.service.apiPost('CompleteAccount',data).subscribe(
      response => {
        if(response.status=='success'){
          this.service.apiGet('getUserInfo?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile)
          .subscribe((result:any) => {
            if(result){
              this.loading = false;
              this.first_name = result.data.user.first_name;
              this.last_name = result.data.user.last_name;
              this.designation = result.data.role.name;
              this.imageSrc = this.srcUrl+'avatar/'+result.data.user.avatar;
              this.city = result.data.user.city;
              this.country = result.data.user.country;
              if(result.data.user.avatar===null){
                this.imageSrc = this.srcUrl+'/avatar/avatar.png';
              }
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
  isnewPassword = true;
  isconPassword = true;
  newPass(){
    this.isnewPassword = !(this.isnewPassword);
  }
  connewPass(){
    this.isconPassword = !(this.isconPassword);
  }

}
