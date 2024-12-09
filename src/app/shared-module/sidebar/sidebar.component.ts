import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import {menuItems} from '../../../assets/ts/menuItems'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems:any = []

  constructor(private authService: AuthService, private router: Router, private commonService:CommonService) {}

  ngOnInit(): void {
    this.loadMenuItems()
  }
 
  logout() {
    console.log('Logging out...');
    this.authService.logout(); 
    console.log('Token removed from local storage.'); 
    this.router.navigate(['/login']); 
  }
  loadMenuItems() {
    const token = this.authService.getToken();
    const decodedToken: any = this.commonService.decodeToken(token);
    const role = decodedToken.role; 

    switch (role) {
        case 0:
            this.menuItems = menuItems.superAdmin; 
            break;
        case 1:
            this.menuItems = menuItems.admin; 
            break;
        case 2:
            this.menuItems = menuItems.physician; 
            break;
            case 7:
              this.menuItems = menuItems.staff; 
              break;
        default:
            this.menuItems = menuItems.superAdmin; // Fallback to superAdmin
            break;
    }
}

  
}
