import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent implements OnInit {
  patientForm: any;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  kinStateList: any[] = [];
kinCityList: any[] = [];
departments: { _id: number, name: string }[] = [
  { _id: 0, name: 'General' },
  { _id: 1, name: 'Cardio' },
  { _id: 2, name: 'Neurology' },
  { _id: 3, name: 'Orthopedics' },
  { _id: 4, name: 'Pediatrics' },
];



  constructor(private fb: FormBuilder, private commonService:CommonService, private toastrService:ToastrService, private router:Router) {
    this.patientFormInitializer()
  }

  ngOnInit(): void {
    this.getCountry();
  }

  patientFormInitializer(){
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''], // no Validators.required
      email: [''], // no Validators.required
      dob: ['', Validators.required],
      address_street1: [''], // no Validators.required
      address_street2: [''], // no Validators.required
      zip_code: [''], // no Validators.required
      medicare_number: [''], // no Validators.required
      medicaid_number: [''], // no Validators.required
      insurance_policy_number: [''], // no Validators.required
      admission_location: [''], // no Validators.required
      insurance_name: [''], // no Validators.required
      ssn: [''], // no Validators.required
      department: [0], // no Validators.required
      address: [''], // no Validators.required
      country: [''], // no Validators.required
      state: [''], // no Validators.required
      city: [''], // no Validators.required
      kin_first_name: [''], // no Validators.required
      kin_last_name: [''], // no Validators.required
      kin_address_street1: [''], // no Validators.required
      kin_address_street2: [''], // no Validators.required
      kin_zip_code: [''], // no Validators.required
      kin_cell_number: [''], // no Validators.required
      kin_landline_number: [''], // no Validators.required
      kin_country: [''], // no Validators.required
      kin_state: [''], // no Validators.required
      kin_city: [''], // no Validators.required
      omrsheet: [null] 
    });
    
  }

  // handleAddPatients() {
  //   if (this.patientForm.valid) {
  //     console.log(this.patientForm.value);
      
  //     this.commonService.post('physician/addPatient', this.patientForm.value)
  //       .pipe(
  //         catchError(error => {
  //           this.toastrService.error(error)
  //           return of(null); 
  //         })
  //       )
  //       .subscribe((response:any) => {
  //         if (response.statusCode == 200) {
  //           this.toastrService.success(response.message);
  //           this.patientForm.reset();
  //           this.router.navigate(['/physician/patient']); 
  //         } else {
  //          this.toastrService.error(response.message)
  //         }
  //       });
  //   } else {
  //     this.patientForm.markAllAsTouched(); 
  //   }
  // }

  handleAddPatients() {
    if (this.patientForm.valid) {
      const formData:any = new FormData();
  
      // Append form values to FormData
      Object.keys(this.patientForm.value).forEach(key => {
        const value = this.patientForm.value[key];
  
        // Append only the form data excluding the file path as a string
        if (key !== 'omrsheet') {
          formData.append(key, value);
        }
      });
  
      // Append the file if it exists
      const file = this.patientForm.get('omrsheet').value;
      if (file instanceof File) {
        formData.append('omrsheet', file, file.name); // Append the file
      }
  
      // Log the form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      this.commonService.post('physician/addPatient', formData)
        .pipe(
          catchError(error => {
            this.toastrService.error(error);
            return of(null);
          })
        )
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(response.message);
            this.patientForm.reset();
            this.router.navigate(['/physician/patient']);
          } else {
            this.toastrService.error(response.message);
          }
        });
    } else {
      this.patientForm.markAllAsTouched();
    }
  }
  
  

  isInvalid(controlName: string) {
    return this.patientForm.get(controlName)?.invalid && this.patientForm.get(controlName)?.touched;
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
    this.patientForm.get('state').setValue(''); 
    this.patientForm.get('city').setValue('');
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
    this.patientForm.get('city').setValue('');
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


  onKinCountryChange(event: Event) {
    const countryId = (event.target as HTMLSelectElement).value;
    this.loadKinStates(countryId);
    this.patientForm.get('kin_state').setValue('');
    this.patientForm.get('kin_city').setValue('');
  }
  
  loadKinStates(countryId: string) {
    this.commonService.get(`common/state?country_id=${countryId}`).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.kinStateList = response.data;
        } else {
          console.error(`Error: ${response.message}`);
          this.handleError(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.handleError('An error occurred while fetching the kin state list.');
      }
    );
  }
  
  onKinStateChange(event: Event) {
    const stateId = (event.target as HTMLSelectElement).value;
    this.loadKinCities(stateId);
    this.patientForm.get('kin_city').setValue('');
  }
  
  loadKinCities(stateId: string) {
    this.commonService.get(`common/city?state_id=${stateId}`).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.kinCityList = response.data;
        } else {
          console.error(`Error: ${response.message}`);
          this.handleError(response.message);
        }
      },
      (error) => {
        console.error('HTTP Error:', error);
        this.handleError('An error occurred while fetching the kin city list.');
      }
    );
  }

  handleError(message: string) {
    alert(message); 
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
      this.patientForm.patchValue({
        omrsheet: file
      });
    }
  }
}
