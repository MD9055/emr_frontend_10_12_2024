import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-physician',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.scss']
})
export class PhysicianComponent implements OnInit {
  physicians: any[] = [];
  totalDocs: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  errorMessage: string | null = null; 
  isDeletePopupVisible: boolean = false;
  physicianToDeleteId: string | null = null;
  searchForm:any
   itemsPerPage: number = 10;

  constructor(private commonService: CommonService, private toastrService: ToastrService,private router:Router, private fb:FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.fetchPhysicians(this.currentPage);
  }

  fetchPhysicians(page: number) {
    const searchQuery = this.searchForm.get('search')!.value.trim();
    const query = searchQuery ?`&search=${encodeURIComponent(searchQuery)}` : '';
    this.commonService.get(`admin/listPhysicians?page=${this.currentPage}&limit=${this.itemsPerPage}${query}`).subscribe({
      next: (response: any) => {
        this.physicians = response.data.docs;
        this.totalDocs = response.data.totalDocs;
        this.totalPages = response.data.totalPages;
        this.toastrService.success(response.message);
      },
      error: (error) => {
        this.toastrService.error(error);
      }
    });
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPhysicians(this.currentPage);
    }
  }

  resetList() {
    this.currentPage = 1; 
    this.fetchPhysicians(this.currentPage);
  }

  openDeletePopup(physicianId: string) {
    this.physicianToDeleteId = physicianId;
    this.isDeletePopupVisible = true;
  }

  // deletePhysician() {
  //   if (this.physicianToDeleteId) {
  //     this.commonService.delete(`admin/deletePhysician/${this.physicianToDeleteId}`).subscribe({
  //       next: (response: any) => {
  //         this.toastrService.success(response.message);
  //         this.fetchPhysicians(this.currentPage); 
  //       },
  //       error: (error) => {
  //         this.toastrService.error(error);
  //       }
  //     });
  //   }
  //   this.isDeletePopupVisible = false;
  // }
 

  deletePhysician(physicianId: any) {
    if (!physicianId) {
        return null;
    }

    const confirmDelete = confirm("Are you sure you want to delete?");
    if (confirmDelete) {
        let body = { _id: physicianId };
        return this.commonService.put('common/deleteByID', body).subscribe(
            (response: any) => {
                if (response.statusCode === 200) {
                    this.toastrService.success(response.message);
                    this.fetchPhysicians(this.currentPage)
                } else {
                    this.toastrService.error(response.message || 'Error occurred during deletion.');
                }
            },
            (error) => {
                this.toastrService.error(error.error?.message || 'An unexpected error occurred.');
            }
        );
    }

    return null; 
}

viewPhysician(_id:any){
  const compressedId = this.commonService.encodeId(_id); // Compress the ID
  this.router.navigate(['superadmin/view-physician'], { queryParams: { accessId: compressedId } });
}

onSearch(): void {
  this.currentPage = 1; // Reset to the first page when searching
  this.fetchPhysicians(this.currentPage);  // Fetch data based on the search input
}



}
