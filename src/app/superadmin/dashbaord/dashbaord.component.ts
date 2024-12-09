import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  token: string | null;
  currentUserInfo: any;
  dailyQuote: string | null = null; // To hold the daily quote
   superAdminCount:any = 0;
   adminNursingHomeCount:any  = 0;
   physicianCount:any  = 0;
   physicianAssistantCount:any  = 0;
   nursePractitionerCount:any  = 0;
   patientCount:any  = 0;
   billerCount:any  = 0;
   adminStaffCount:any  = 0;



  constructor(
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.token = this.authService.getToken();
  }

  ngOnInit(): void {
    this.fetchCurrentUserDetails(this.token);
    this.dailyQuote = this.getDailyQuote(); // Get daily quote on initialization
    this.fetchDashboard()
  }

  fetchCurrentUserDetails(token: any) {
    if (token) {
      let decodedToken = this.commonService.decodeToken(token);
      if (decodedToken) {
        this.commonService.get(`common/getById?_id=${decodedToken.userId}`).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.currentUserInfo = response?.data;
            console.log(this.currentUserInfo);
          }
        });
      }
    }
  }


   getDailyQuote(): any {
  return this.commonService.getDailyQuote()
  }

  greetMsg() {
    return this.commonService.getGreeting();
  }

  fetchDashboard() {
    this.commonService.post(`superadmin/dashboard`, {}).subscribe((response: any) => {
      if (response.statusCode === 200) {
        response.data.forEach((item:any) => {
          switch (item.role) {
            case 0:
              this.superAdminCount = item.count;
              break;
            case 1:
              this.adminNursingHomeCount = item.count;
              break;
            case 2:
              this.physicianCount = item.count;
              break;
            case 3:
              this.physicianAssistantCount = item.count;
              break;
            case 4:
              this.nursePractitionerCount = item.count;
              break;
            case 5:
              this.patientCount = item.count;
              break;
            case 6:
              this.billerCount = item.count;
              break;
            case 7:
              this.adminStaffCount = item.count;
              break;
            default:
              console.log('Unknown role: ' + item.role);
          }
        });
  
      }
    });
  }
  
}
