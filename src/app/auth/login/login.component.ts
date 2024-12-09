import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  passwordClass: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private commonService:CommonService,private authService: AuthService, private toastrService:ToastrService ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }

  loginFormSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log(formData);
      this.commonService.post('auth/login', formData).subscribe(response => {
        if (response.statusCode === 200) {
          console.log(response);
          
          // Safely access the token
          const token = response?.token || response?.data?.token;
      
          if (token) {
              this.authService.login(token);
      
              const decodedToken = this.commonService.decodeToken(token);
              console.log(decodedToken);
              this.toastrService.success(response.message);
              this.commonService.redirectBasedOnRole(decodedToken.role);
          } else {
              console.error('Token not found in the response');
              this.toastrService.error('Login failed: No token received');
          }
      }
       else {
          // this.errorMessage = response.message;
          this.toastrService.error(response.message)
          
        }
      }, error => {
        this.errorMessage = 'Login failed. Please try again.';
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }
  

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }

  get formControls() {
    return this.loginForm.controls;
  }

  isValidInput(fieldName: string): boolean {
    return this.formControls[fieldName].touched && this.formControls[fieldName].valid;
  }

  isInvalidInput(fieldName: string): boolean {
    return this.formControls[fieldName].touched && this.formControls[fieldName].invalid;
  }

  
}