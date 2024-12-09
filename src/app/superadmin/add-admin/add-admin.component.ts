import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {
  adminForm: any;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  adminId: any;
  status: any;

  constructor(private fb: FormBuilder, private commonService: CommonService, private route: ActivatedRoute, private router:Router, private toastService:ToastrService) {
    this.accessActivatedRouteElement();
  }

  ngOnInit(): void {
    this.getCountry();
    this.initializeAddForm();
  }

  accessActivatedRouteElement() {
    this.route.queryParams.subscribe(params => {
      const encodedId = params['accessId'];
      
      if (encodedId) {
        this.adminId = this.commonService.decodeId(encodedId);
        console.log(this.adminId);
        
        if (this.adminId) {
          this.status = "Update";
          this.commonService.get(`common/getById?_id=${this.adminId}`).subscribe(
            (response: any) => {
              console.log(response);
              if (response.statusCode === 200) {
                console.log(response.data);
                this.loadStates(response.data.country).then(() => {
                  this.loadCities(response.data.state).then(() => {
                    this.patchFormValues(response.data);
                  });
                });
              } else {
                console.error('Error fetching admin data:', response.message);
              }
            },
            (error) => {
              console.error('Error fetching admin data:', error);
            }
          );
        }
      }
    });
  }

  initializeAddForm() {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      dob: ['', Validators.required],
      addressStreet1: ['', Validators.required],
      addressStreet2: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddressStreet1: ['', Validators.required],
      companyAddressStreet2: ['', Validators.required],
      companyZipCode: ['', Validators.required],
      companyMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      companyFax: ['']
    });
  }

  patchFormValues(data: any) {
    this.adminForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.phone,
      dob: new Date(data.dob).toISOString().substring(0, 10),
      addressStreet1: data.address_street1,
      addressStreet2: data.address_street2,
      zipCode: data.zip_code,
      country: data.country,
      state: data.state,
      city: data.city,
      companyName: data.companyName,
      companyAddressStreet1: data.companyAddressStreet1,
      companyAddressStreet2: data.companyAddressStreet2,
      companyZipCode: data.companyZipCode,
      companyMobile: data.companyMobile,
      companyFax: data.companyFax 
    });
  }


  updateAdmin(){
    if (this.adminForm.valid) {
      const formData = {
        ...this.adminForm.value,
        role: 0 
      };
      if(this.adminId){
        formData.id = this.adminId
      }
  
      this.commonService.post('superadmin/admin', formData).subscribe(
        (response: any) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            console.log('Admin saved successfully:', response.data);
            this.router.navigateByUrl('/superadmin/admin')
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while saving the admin.');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const formData = {
        ...this.adminForm.value,
        role: 0 
      };
      this.commonService.post('superadmin/admin', formData).subscribe(
        (response: any) => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            console.log('Admin saved successfully:', response.data);
            this.toastService.success(response.message)
            this.onCancel();
            this.router.navigateByUrl('/superadmin/admin')

          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while saving the admin.');
        }
      );
    }
  }

  getCountry() {
    this.commonService.get('common/country').subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.countryList = response.data;
        } else {
          console.error(`Error: ${response.message}`);
          this.handleError(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.handleError('An error occurred while fetching the country list.');
      }
    );
  }

  onCountryChange(event: Event) {
    const countryId = (event.target as HTMLSelectElement).value;
    this.loadStates(countryId);
    this.adminForm.get('state').setValue(''); 
    this.adminForm.get('city').setValue('');
  }

  loadStates(countryId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.commonService.get(`common/state?country_id=${countryId}`).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.stateList = response.data;
            resolve(response.data);
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
            reject(response.message);
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while fetching the state list.');
          reject(error);
        }
      );
    });
  }

  onStateChange(event: Event) {
    const stateId = (event.target as HTMLSelectElement).value;
    this.loadCities(stateId);
    this.adminForm.get('city').setValue('');
  }

  loadCities(stateId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.commonService.get(`common/city?state_id=${stateId}`).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.cityList = response.data;
            resolve(response.data);
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
            reject(response.message);
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while fetching the city list.');
          reject(error);
        }
      );
    });
  }

  handleError(message: string) {
    alert(message); 
  }

  onCancel(): void {
    this.adminForm.reset();
    this.countryList = [];
    this.stateList = [];
    this.cityList = [];
  }
}
