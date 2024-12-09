import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import {quotes} from '../../assets/ts/quotes'
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private quotes = quotes


  private apiUrl = environment.apiUrl; // replace with your API URL

  constructor(private http: HttpClient, private router:Router) { }

  // GET request
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }
  getRequest(endpoint: string, params?: { [key: string]: string }): Observable<any> {
    let httpParams = new HttpParams();

    

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }

    return this.http.get(`${this.apiUrl}/${endpoint}`, { params: httpParams });
  }

  download(id: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem("token") || '', 
    });

    return this.http.get(`${this.apiUrl}/notes/downloadpdf`, {
      headers: headers,
      params: { id: id },
      responseType: 'blob',
    });
  }

  // POST request
  post(endpoint: string, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, body);
  }

  // PUT request
  put(endpoint: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, body);
  }

  // DELETE request
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`);
  }

  decodeToken(token: any): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 0:
        return 'Super Admin';
      case 1:
        return 'Admin (Nursing Home)';
      case 2:
        return 'Physician';
      case 3:
        return 'Physician Assistant';
      case 4:
        return 'Nurse Practitioner';
      case 5:
        return 'Patient';
      case 6:
        return 'Biller';
        case 7:
          return 'Admin Staff';
      default:
        return 'Unknown Role';
    }
  }

  capitalizeFirstLetter(input: string): string {
    if (!input) return '';
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

   redirectBasedOnRole(role: number) {
    switch (role) {
      case 0: // Super Admin
        this.router.navigateByUrl('/superadmin/dashboard').then(nav => {
          if (nav) {
            console.log('Navigation to Super Admin dashboard successful');
          } else {
            console.log('Navigation to Super Admin dashboard failed');
          }
        });
        break;
  
      case 1: // Admin (Nursing Home)
        this.router.navigate(['/admin/dashboard']).then(nav => {
          if (nav) {
            console.log('Navigation to Admin (Nursing Home) dashboard successful');
          } else {
            console.log('Navigation to Admin (Nursing Home) dashboard failed');
          }
        });
        break;
  
      case 2: // Physician
        this.router.navigate(['/physician/dashboard']).then(nav => {
          if (nav) {
            console.log('Navigation to Physician dashboard successful');
          } else {
            console.log('Navigation to Physician dashboard failed');
          }
        });
        break;

        case 7: // Physician
        this.router.navigate(['/staff/dashboard']).then(nav => {
          if (nav) {
            console.log('Navigation to Staff dashboard successful');
          } else {
            console.log('Navigation to Staff dashboard failed');
          }
        });
        break;
  
      default:
        this.router.navigate(['/default-route']).then(nav => {
          if (nav) {
            console.log('Navigation to default route successful');
          } else {
            console.log('Navigation to default route failed');
          }
        });
        break;
    }
  }

   getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours >= 5 && hours < 12) {
        greeting = "Good Morning";
    } else if (hours >= 12 && hours < 17) {
        greeting = "Good Afternoon";
    } else if (hours >= 17 && hours < 21) {
        greeting = "Good Evening";
    } else {
        greeting = "Hello"; // Fallback for late night
    }

    return greeting;
}

 shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

getDailyQuote(): any {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('quoteDate');

  if (savedDate === today) {
    return localStorage.getItem('dailyQuote') || null;
  }

  this.shuffleArray(this.quotes);

  localStorage.setItem('quoteDate', today);
  const dailyQuote = this.quotes[0].quote;
  localStorage.setItem('dailyQuote', dailyQuote);

  return dailyQuote;
}


encodeId(id: string): string {
  return btoa(id); 
}

decodeId(encodedId: string): string {
  return atob(encodedId); 
}

  

}