import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  decodedToken: any;

  constructor(private authService:AuthService, private commonService:CommonService, private router:Router){

  }

  ngOnInit() {
    this.getTokenMethod().then((token)=>{
     this.decodedToken =  this.commonService.decodeToken(token)
     
    })
  }

  getTokenMethod() {
    return new Promise((resolve, reject) => {
      const token = this.authService.getToken();
      if (token) {
        resolve(token);
      } else {
        reject('No token found'); 
      }
    });
  }

  getRoleName(role:any){
    return this.commonService.getRoleName(role)
  }

  capitalizeFirstLetter(name: string){
  return   this.commonService.capitalizeFirstLetter(name)
  }

  roleBaseNavigation(): string {
    switch (this.decodedToken.role) {
      case 0:
        return 'superadmin/settings';
      case 1:
        return 'admin/settings';
      case 2:
        return 'physician/settings';
      case 5:
        return 'patient/settings';
      case 7:
        return 'staff/settings';
      default:
        return 'unknown';
    }
  }

  navigateBasedOnRole(): void {
    const route = this.roleBaseNavigation();
    
    if (route !== 'unknown') {
      this.router.navigate([route]);
    } else {
      console.error('Unknown role, cannot navigate.');
      
    }
  }

 


}
  



