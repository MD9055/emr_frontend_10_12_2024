import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: any;
  passwordClass: boolean = false;
  confirmPasswordClass: boolean = false;
  token: string | null = null;
  userInfo: any;


  constructor(private fb: FormBuilder,
    private router: Router,
    private commonService:CommonService,
    private route: ActivatedRoute, 
    private toastrService: ToastrService,



  ) {
    this.resetFormInitializer();
  }

  ngOnInit(): void {
    this.extractTokenFromUrl();
  }

  resetFormInitializer(){
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: any) {
    return form.get('password').value === form.get('confirmPassword').value ? null : { matching: true };
  }

  passwordStrengthValidator(control: any) {
    const value = control.value;
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordPattern.test(value) ? null : { weak: true };
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }

  toggleConfirmPassword() {
    this.confirmPasswordClass = !this.confirmPasswordClass;
  }

  isInvalidInput(controlName: string) {
    return this.resetPasswordForm.get(controlName).invalid && this.resetPasswordForm.get(controlName).touched;
  }

  resetPasswordSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password } = this.resetPasswordForm.value;
      let payload = { password:password, confirmPassword: password, _id: this.userInfo._id }

      this.commonService.post('auth/resetPassword',payload )
        .subscribe(
          (response:any) => {
           this.toastrService.success(response.message);
            this.resetPasswordForm.reset();
            this.router.navigate(['/']); 
          },
          (error:any) => {
            console.error('Error resetting password:', error);
            this.toastrService.error(error)
          }
        );
    }
  }

  extractTokenFromUrl() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (this.token) {
        const decodedToken = this.commonService.decodeToken(this.token);
        if (decodedToken) {
          this.fetchUser(decodedToken._id);
        }
      }
    });
  }
  fetchUser(_id: any) {
    this.commonService.get(`common/getById?_id=${_id}`).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.userInfo = response.data;         
        } else {
          this.toastrService.error( response.message);
        }
      },
      (error) => {
        this.toastrService.error(error);
      }
    );
  }
}
