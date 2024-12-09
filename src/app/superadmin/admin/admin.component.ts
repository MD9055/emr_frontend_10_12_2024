import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  admins: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalDocs: number = 0;
  adminForm: FormGroup;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadAdminData();
  }

  showSuccess(message: string, title: string = 'Success', duration: number = 2000) {
    this.toastService.success(message, title, {
      timeOut: duration,
      progressBar: true,
      closeButton: true
    });
  }

  loadAdminData(): void {
    this.spinnerService.show();
    const searchQuery = this.adminForm.get('search')!.value.trim();
    const query = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
    this.commonService.get(`superadmin/alladmins?page=${this.currentPage}&limit=${this.itemsPerPage}${query}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching admin data:', error);
          this.toastService.error('Failed to load admin data. Please try again.', 'Error');
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response && response.statusCode === 200) {
          this.admins = response.data.docs;
          this.totalPages = response.data.totalPages;
          this.totalDocs = response.data.totalDocs;
          this.spinnerService.hide();
          this.showSuccess(response.message);
        } else {
          this.toastService.warning('No admin data found.');
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to the first page when searching
    this.loadAdminData();  // Fetch data based on the search input
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAdminData();
    }
  }

  getCurrentMin(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getCurrentMax(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalDocs);
  }

  deleteAdmin(physicianId: any) {
    if (!physicianId) {
      return null;
    }

    const confirmDelete = confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      let body = { _id: physicianId };
      return this.commonService.put('common/deleteByID', body).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.toastService.success(response.message);
            this.loadAdminData();
          } else {
            this.toastService.error(response.message || 'Error occurred during deletion.');
          }
        },
        (error) => {
          this.toastService.error(error.error?.message || 'An unexpected error occurred.');
        }
      );
    }

    return null; 
  }

  editAdmin(_id: any) {
    const compressedId = this.commonService.encodeId(_id); // Compress the ID
    this.router.navigate(['superadmin/add-admin'], { queryParams: { accessId: compressedId } });
  }

  downloadPDF(): void {
    const doc = new jsPDF();
  
    // Define the columns for the table
    const columns = [
      { header: 'S.N.', dataKey: 'sn' },
      { header: 'First Name', dataKey: 'firstName' },
      { header: 'Last Name', dataKey: 'lastName' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Address', dataKey: 'address' }
    ];
  
    // Log the rows for debugging
    // console.log('Rows data:', rows);
  
    // Generate the table in the PDF
    autoTable(doc, {
      head: [columns.map(col => col.header)], // Header as an array of arrays
      body: this.admins.map((admin) => ({
        sn: admin.sn,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        address: admin.address,
      })),
      startY: 20,
      margin: { top: 10 }, // Adjust margins if necessary
      styles: {
        overflow: 'linebreak',
        cellWidth: 'auto',
        fontSize: 10,
        font: 'Helvetica',
      },
    });
  
    // Save the PDF
    doc.save('admins.pdf');
  }

 

downloadExcel(): void {
  // Prepare data
  const data = this.admins.map((admin, index) => ({
    'S.N.': index + 1 + ((this.currentPage - 1) * this.itemsPerPage),
    'First Name': admin.firstName,
    'Last Name': admin.lastName,
    'Email': admin.email,
    'Address': admin.address_street1 // Adjust based on your data structure
  }));

  // Create a new workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Admins');

  // Export the workbook
  XLSX.writeFile(workbook, 'admins.xlsx');
}

  
  
  
}
