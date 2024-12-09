import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {
  staffForm: FormGroup;
  submitted = false;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  adminId: any; // To hold the admin ID
  status: string = '';

  constructor(
    private formBuilder: FormBuilder, 
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.staffForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      dob: ['', Validators.required],
      addressStreet1: ['', Validators.required],
      addressStreet2: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCountry();
    this.accessActivatedRouteElement(); // Call to check if editing an existing staff
  }

  get f() {
    return this.staffForm.controls;
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
                // Load states and cities based on country and state
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

  onCountryChange(event: Event) {
    const countryId = (event.target as HTMLSelectElement).value;
    this.loadStates(countryId);
    this.staffForm.get('state')?.setValue('');
    this.staffForm.get('city')?.setValue('');
  }

  loadStates(countryId: string) {
    return this.commonService.get(`common/state?country_id=${countryId}`).toPromise().then(
      (response: any) => {
        if (response.statusCode === 200) {
          this.stateList = response.data;
        } else {
          console.error(`Error: ${response.message}`);
          this.handleError(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.handleError('An error occurred while fetching the state list.');
      }
    );
  }

  onStateChange(event: Event) {
    const stateId = (event.target as HTMLSelectElement).value;
    this.loadCities(stateId);
    this.staffForm.get('city')?.setValue('');
  }

  loadCities(stateId: string) {
    return this.commonService.get(`common/city?state_id=${stateId}`).toPromise().then(
      (response: any) => {
        if (response.statusCode === 200) {
          this.cityList = response.data;
        } else {
          console.error(`Error: ${response.message}`);
          this.handleError(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.handleError('An error occurred while fetching the city list.');
      }
    );
  }

  handleError(message: string) {
    alert(message);
  }

  patchFormValues(data: any) {
    this.staffForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dob: new Date(data.dob).toISOString().substring(0, 10),
      addressStreet1: data.address_street1,
      addressStreet2: data.address_street2,
      zipCode: data.zip_code,
      country: data.country,
      state: data.state,
      city: data.city
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.staffForm.invalid) {
      return;
    }

    const formData = this.staffForm.value;

    this.commonService.post('admin/addUpdateStaff', formData).subscribe(
      (response: any) => {
        if (response.statusCode === 201) {
          alert(response.message);
          this.staffForm.reset();
          this.submitted = false;
        } else {
          this.handleError(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.handleError('An error occurred while saving staff details.');
      }
    );
  }

  onCancel() {
    this.staffForm.reset();
    this.submitted = false;
    this.router.navigateByUrl('/admin/staff')
  }
}
