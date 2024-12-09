import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { MaskingService } from 'src/app/services/masking.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patients: any;
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalDocs: number = 0;
  searchForm:any

  constructor(
    private commonService:CommonService,
    private encryptionDecryptionService:EncryptionDecryptionService,
    private maskingService:MaskingService,
    private router : Router,
    private fb: FormBuilder
  ){
    this.searchForm = this.fb.group({
      search: ['']
    });

  }
  ngOnInit(): void {
      this.fetchPatients()
  }

  fetchPatients() {
    const searchQuery = this.searchForm.get('search')!.value.trim();
    const query = searchQuery ?`&search=${encodeURIComponent(searchQuery)}` : '';
    return this.commonService.get(`physician/listPatients?page=${this.currentPage}&limit=${this.itemsPerPage}${query}`).subscribe(
        (response: any) => {
            if (response.statusCode === 200) {
                 this.patients = response.data.docs; 
                 this.totalPages = response.data.totalPages;
                 this.totalDocs = response.data.totalDocs;
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

viewPhysician(_id:any){
  const compressedId = this.commonService.encodeId(_id); // Compress the ID
  this.router.navigate(['superadmin/view-patient'], { queryParams: { accessId: compressedId } });
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.fetchPatients();
  }
}

getCurrentMin(): number {
  return (this.currentPage - 1) * this.itemsPerPage + 1;
}

getCurrentMax(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.totalDocs);
}

onSearch(): void {
  this.currentPage = 1; // Reset to the first page when searching
  this.fetchPatients();  // Fetch data based on the search input
}

}

