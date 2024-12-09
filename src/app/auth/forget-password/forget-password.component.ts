import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: any;
  successMessage: any;
  errorMessage: any;

  constructor(private fb: FormBuilder, private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.forgetPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const payload = {
        email:this.forgetPasswordForm.value.email
      }

      this.commonService.post(`auth/forgetPassword`, payload).subscribe(
        (response:any) => {
          this.successMessage = response.message;
          this.forgetPasswordForm.reset();
        },
        error => {
          this.errorMessage = error.error.message || 'An error occurred. Please try again.';
        }
      );
    }
  }
}
