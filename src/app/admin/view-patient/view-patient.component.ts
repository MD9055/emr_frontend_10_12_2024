import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.scss']
})
export class ViewPatientComponent implements OnInit {
  patientForm: any;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  kinStateList: any[] = [];
  kinCityList: any[] = [];
  departments = [
    { _id: 0, name: 'General' },
    { _id: 1, name: 'Cardio' },
    { _id: 2, name: 'Neurology' },
    { _id: 3, name: 'Orthopedics' },
    { _id: 4, name: 'Pediatrics' },
  ];
  adminId: any;
  status: any;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionDecryptionService: EncryptionDecryptionService,
  ) {
    this.patientFormInitializer();
  }

  ngOnInit(): void {
    this.getCountry();
    this.accessActivatedRouteElement();
  }

  patientFormInitializer() {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      email: [''],
      dob: ['', Validators.required],
      address_street1: [''],
      address_street2: [''],
      zip_code: [''],
      medicare_number: [''],
      medicaid_number: [''],
      insurance_policy_number: [''],
      admission_location: [''],
      insurance_name: [''],
      ssn: [''],
      department: [0],
      address: [''],
      country: [''],
      state: [''],
      city: [''],
      kin_first_name: [''],
      kin_last_name: [''],
      kin_address_street1: [''],
      kin_address_street2: [''],
      kin_zip_code: [''],
      kin_cell_number: [''],
      kin_landline_number: [''],
      kin_country: [''],
      kin_state: [''],
      kin_city: [''],
    });
  }

  accessActivatedRouteElement() {
    this.route.queryParams.subscribe(params => {
      const encodedId = params['accessId'];

      if (encodedId) {
        this.adminId = this.commonService.decodeId(encodedId);
        console.log(this.adminId)
        if (this.adminId) {
          this.status = "Update";

          this.commonService.get(`common/getById?_id=${this.adminId}`).subscribe(
            (response: any) => {
              console.log(response)
              if (response.statusCode === 200) {
                if(response.data.country){
                  this.loadStates(response.data.country).then(() => {
                    this.loadCities(response.data.state).then(() => {
                      
                    });
                  });
                }
                this.patchFormValues(response?.data);
               
              } else {
                console.error('Error fetching patient data:', response.message);
              }
            },
            (error) => {
              console.error('Error fetching patient data:', error);
            }
          );
        }
      }
    });
  }

  patchFormValues(patientData: any) {
    this.patientForm.patchValue({
      firstName: this.decrypt(patientData.firstName) || '',
      lastName: this.decrypt(patientData.lastName) || '',
      phone: this.decrypt(patientData.phone) || '',
      email: this.decrypt(patientData.email) || '',
      dob: new Date(patientData.dob).toISOString().substring(0, 10) || '',
      address_street1: this.decrypt(patientData.address_street1) || '',
      address_street2: this.decrypt(patientData.address_street2) || '',
      zip_code: patientData.zip_code || '',
      medicare_number: patientData.medicare_number || '',
      medicaid_number: patientData.medicaid_number || '',
      insurance_policy_number: patientData.insurance_policy_number || '',
      admission_location: patientData.admission_location || '',
      insurance_name: patientData.insurance_name || '',
      ssn: patientData.ssn || '',
      department: patientData.department || 0,
      country: patientData.country || '',
      state: patientData.state || '',
      city: patientData.city || '',
      kin_first_name: this.decrypt(patientData?.kin_information?.firstName) || '',
      kin_last_name: this.decrypt(patientData?.kin_information?.lastName) || '',
      kin_address_street1: this.decrypt(patientData?.kin_information?.kin_address_street1) || '',
      kin_address_street2: this.decrypt(patientData?.kin_information?.kin_address_street2) || '',
      kin_zip_code: this.decrypt(patientData?.kin_information?.zip_code) || '',
      kin_cell_number: "9988778877",  // Placeholder
      kin_landline_number: "7766776677",  // Placeholder
      kin_country: patientData?.kin_information?.country || '',
      kin_state: patientData?.kin_information?.state || '',
      kin_city: patientData?.kin_information?.city || '',
    });

    const kinCountry = patientData?.kin_information?.country;
    const kinState = patientData?.kin_information?.state;

    if (kinCountry) {
      this.loadKinStates(kinCountry).catch(error => {
        console.error("Error loading kin states:", error);
      });
    } else {
      console.warn("Kin country is undefined; skipping state loading.");
    }

    if (kinState) {
      this.loadKinCities(kinState).catch(error => {
        console.error("Error loading kin cities:", error);
      });
    } else {
      console.warn("Kin state is undefined; skipping city loading.");
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

  loadStates(countryId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!countryId) {
        console.warn("Country ID is undefined; cannot load states.");
        return reject();
      }
      this.commonService.get(`common/state?country_id=${countryId}`).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.stateList = response.data;
            resolve();
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
            reject();
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while fetching the state list.');
          reject();
        }
      );
    });
  }

  loadCities(stateId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!stateId) {
        console.warn("State ID is undefined; cannot load cities.");
        return reject();
      }
      this.commonService.get(`common/city?state_id=${stateId}`).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.cityList = response.data;
            resolve();
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
            reject();
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while fetching the city list.');
          reject();
        }
      );
    });
  }

  onCountryChange(event: Event) {
    const countryId = (event.target as HTMLSelectElement).value;
    this.loadStates(countryId).then(() => {
      this.patientForm.get('state').setValue('');
      this.patientForm.get('city').setValue('');
    }).catch(error => {
      console.error("Error loading states on country change:", error);
    });
  }

  onStateChange(event: Event) {
    const stateId = (event.target as HTMLSelectElement).value;
    this.loadCities(stateId).then(() => {
      this.patientForm.get('city').setValue('');
    }).catch(error => {
      console.error("Error loading cities on state change:", error);
    });
  }

  onKinCountryChange(event: Event) {
    const countryId = (event.target as HTMLSelectElement).value;
    this.loadKinStates(countryId).then(() => {
      this.patientForm.get('kin_state').setValue('');
      this.patientForm.get('kin_city').setValue('');
    }).catch(error => {
      console.error("Error loading kin states:", error);
    });
  }

  loadKinStates(countryId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!countryId) {
        console.warn("Kin country ID is undefined; cannot load kin states.");
        return reject();
      }
      this.commonService.get(`common/state?country_id=${countryId}`).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.kinStateList = response.data;
            resolve();
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
            reject();
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while fetching the kin state list.');
          reject();
        }
      );
    });
  }

  onKinStateChange(event: Event) {
    const stateId = (event.target as HTMLSelectElement).value;
    this.loadKinCities(stateId).catch(error => {
      console.error("Error loading kin cities:", error);
    });
    this.patientForm.get('kin_city').setValue('');
  }

  loadKinCities(stateId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!stateId) {
        console.warn("Kin state ID is undefined; cannot load kin cities.");
        return reject();
      }
      this.commonService.get(`common/city?state_id=${stateId}`).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.kinCityList = response.data;
            resolve();
          } else {
            console.error(`Error: ${response.message}`);
            this.handleError(response.message);
            reject();
          }
        },
        (error) => {
          console.error('HTTP Error:', error);
          this.handleError('An error occurred while fetching the kin city list.');
          reject();
        }
      );
    });
  }
  handleError(message: string) {
    alert(message);
  }
  decrypt(text: any) {
    if (text === undefined || text === null) {
      console.log("Input is undefined or null, bypassing decryption.");
      return '';
    }
    console.log(text);
    return this.encryptionDecryptionService.decrypt(text);
  }

  
  onCancel() {
    this.router.navigateByUrl('/superadmin/patient')
   }
  
}
