import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-physician',
  templateUrl: './view-physician.component.html',
  styleUrls: ['./view-physician.component.scss']
})
export class ViewPhysicianComponent implements OnInit {
  physicianForm: any;
  submitted = false;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  adminId: any; // Variable to hold the decoded ID
  status: any; // To track whether it's an update

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute // Injecting ActivatedRoute
  ) {
    this.physicianForm = this.fb.group({
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
      medicalLicenceNumber: ['', Validators.required],
      medicalLicenceDate: ['', Validators.required],
      deaNumber: ['', Validators.required],
      deaExpiryDate: ['', Validators.required],
      cdsNumber: ['', Validators.required],
      cdsExpiryDate: ['', Validators.required],
      npiNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCountry(); // Fetch countries on initialization
    this.accessActivatedRouteElement(); // Check for route parameters to load data
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

  patchFormValues(data: any) {
    this.physicianForm.patchValue({
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
      city: data.city,
      medicalLicenceNumber: data.medicalLicenceNumber,
      medicalLicenceDate: new Date(data.medical_licence_date).toISOString().substring(0, 10),
      deaNumber: data.deaNumber,
      deaExpiryDate: new Date(data.dea_expiry_date).toISOString().substring(0, 10),
      cdsNumber: data.cdsNumber,
      cdsExpiryDate: new Date(data.cds_expiry_date).toISOString().substring(0, 10),
      npiNumber: data.npiNumber,
    });
  }

  formatDateString(dateString:any) {
    // Create a Date object from the ISO date string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digit days
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Format to dd-mm-yyyy
    return `${day}-${month}-${year}`;
}




  onCancel() {
   this.router.navigateByUrl('/superadmin/physician')
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
    this.physicianForm.get('state').setValue(''); 
    this.physicianForm.get('city').setValue('');
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
    this.physicianForm.get('city').setValue('');
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
}
