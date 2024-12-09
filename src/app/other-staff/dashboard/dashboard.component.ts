import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  token: string | null;
  currentUserInfo: any;
  dailyQuote: string | null = null; // To hold the daily quote



  constructor(
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.token = this.authService.getToken();
  }

  ngOnInit(): void {
    this.fetchCurrentUserDetails(this.token);
    this.dailyQuote = this.getDailyQuote(); // Get daily quote on initialization
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
}
