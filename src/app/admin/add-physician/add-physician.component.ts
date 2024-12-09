import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-physician',
  templateUrl: './add-physician.component.html',
  styleUrls: ['./add-physician.component.scss']
})
export class AddPhysicianComponent implements OnInit {
  doctorForm: any;
  submitted = false;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  adminId: any; 
  status: any;


  constructor(private fb: FormBuilder, private commonService: CommonService, private toastrService:ToastrService, private router:Router,


  ) {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      dob: ['', Validators.required],
      addressStreet1: ['', Validators.required],
      addressStreet2: [''],
      zipCode: [''],
      country: [''],
      state: [''],
      city: [''],
      medicalLicenceNumber: [''],
      medicalLicenceDate: [''],
      deaNumber: [''],
      deaExpiryDate: [''],
      cdsNumber: [''],
      cdsExpiryDate: [''],
      npiNumber: [''],
    });
  }

  ngOnInit():any {
    this.getCountry(); // Fetch countries on initialization
  }

  onSubmit() {
    this.submitted = true;
    if (this.doctorForm.valid) {
      console.log(this.doctorForm.value);
      this.addPhysician()
    }
  }

  addPhysician() {
    const physicianData = this.doctorForm.value;
    this.commonService.post('admin/addUpdatePhysician', physicianData).subscribe(
      (response: any) => {
        if (response.statusCode === 201) {
            this.toastrService.success("Physician Added Successfully")
          this.onCancel(); 
          this.router.navigate(['/admin/physician'])
        } else {
          console.error(`Error: ${response.message}`);
          this.toastrService.error(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.toastrService.error('An error occurred while adding the physician.');
      }
    );
  }

  onCancel() {
    this.doctorForm.reset();
    this.submitted = false;
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
    this.doctorForm.get('state').setValue(''); 
    this.doctorForm.get('city').setValue('');
  }

  loadStates(countryId: string) {
    this.commonService.get(`common/state?country_id=${countryId}`).subscribe(
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
    this.doctorForm.get('city').setValue('');
  }

  loadCities(stateId: string) {
    this.commonService.get(`common/city?state_id=${stateId}`).subscribe(
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



  patchFormValues(data: any) {
    this.doctorForm.patchValue({
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

  handleError(message: string) {
    alert(message); 
  }
}
