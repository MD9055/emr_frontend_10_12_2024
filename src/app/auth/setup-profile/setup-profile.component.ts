import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.component.html',
  styleUrls: ['./setup-profile.component.scss']
})
export class SetupProfileComponent implements OnInit {
  profileForm: any; 
  passwordClass: boolean = false;
  confirmPasswordClass: boolean = false; 
  token: string | null = null;
  userInfo: any;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private commonService: CommonService, 
    private toastrService: ToastrService,
    private router: Router,
    private authService:AuthService
  ) {
    this.formInitializer();
  }
  ngOnInit(): void {
    this.extractTokenFromUrl();
  }
  formInitializer() {
    this.profileForm = this.fb.group({
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: true }, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    });
  }
  loadUserData(userData: any) {
    this.profileForm.patchValue(userData);
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
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
  toggleConfirmPassword() {
    this.confirmPasswordClass = !this.confirmPasswordClass; 
  }
  profileFormSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);

      let payload = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        password: this.profileForm.value.password,
        confirmPassword:this.profileForm.value.password,
        _id:this.userInfo._id
      };
      this.commonService.post('auth/updateProfile', payload).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(response.message);

            const newToken = response.data.token; 
            if (newToken) {
              this.authService.setToken(newToken)
            }
            let decodedToken = this.commonService.decodeToken(newToken)
            this.commonService.redirectBasedOnRole(decodedToken.role)
           

          } else {
            this.toastrService.error(response.message);
          }
        },
        (error) => {
          console.error('HTTP error updating profile:', error);
          this.toastrService.error('An error occurred while updating your profile.');
        }
      );
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  isInvalidInput(controlName: string): boolean {
    return this.profileForm.get(controlName).invalid && this.profileForm.get(controlName).touched;
  }

  fetchUser(_id: any) {
    this.commonService.get(`common/getById?_id=${_id}`).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.userInfo = response.data;
          this.loadUserData(this.userInfo);
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
