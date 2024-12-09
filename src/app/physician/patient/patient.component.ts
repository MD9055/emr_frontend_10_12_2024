import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { MaskingService } from 'src/app/services/masking.service';
import {environment} from "../../../environments/environment"
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patients: any;

  constructor(
    private commonService:CommonService,
    private encryptionDecryptionService:EncryptionDecryptionService,
    private maskingService:MaskingService,
    private router :Router
  ){

  }
  ngOnInit(): void {
      this.fetchPatients()
  }

  fetchPatients() {
    return this.commonService.get('physician/listPatients').subscribe(
        (response: any) => {
            if (response.statusCode === 200) {
                 this.patients = response.data.docs;
                 this.patients.forEach((element: any) => {
                  if (element ) {
                    if(element.omrSheet != undefined){
                      element.omrSheet = environment.apiUrl + '/' + element.omrSheet;

                    }
                  }
                  console.log(element)
              });
              
            } else {
                console.error('Error fetching patients:', response.message);
                throw new Error(response.message || 'Failed to fetch patients');
            }
        },
        (error: any) => {
            console.error('API error:', error);
            throw new Error('Internal Server Error: Unable to fetch patients');
        }
    );
}
decodeText(text:any){
  if(text == ''){
    return text
  }else{
    return this.encryptionDecryptionService.decrypt(text)

  }
}
maskEmail(email:any){
  return this.maskingService.maskEmail(email)
}

maskPhone(phone:any){
  return this.maskingService.maskPhone(phone)
}

editpatient(_id: any) {
  const compressedId = this.commonService.encodeId(_id); // Compress the ID
  this.router.navigate(['physician/edit-patient'], { queryParams: { accessId: compressedId } });
}
deleteAdmin(_id:any){

}

}

