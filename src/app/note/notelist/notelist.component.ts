import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionDecryptionService } from 'src/app/services/encryption-decryption.service';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-notelist',
  templateUrl: './notelist.component.html',
  styleUrls: ['./notelist.component.scss']
})
export class NotelistComponent implements OnInit {
  user: any;
  list: any[] = [];
  id: any;
  searchForm:any
  currentPage:any = 1
  totalPages:any = 1
  totalDocs:any = 10
  patientId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private noteService:NotesService,
    private encryptionDecryptionService:EncryptionDecryptionService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patientId = params['patientId'];
      if (this.patientId) {
        console.log('Patient ID:', this.patientId);
      }
    });
    this.fetchList();
  }

   fetchList() {
    // const result = await getPatientHistoryNote(payload);
     this.noteService.getHistoryNotes(this.patientId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.list = response.data;
      }
    })
  }

  async handleDownload(id: string, type: string) {
    
  }

  onSearch() {
    // Implement search functionality
  }

  resetList() {
    //this.searchForm.reset();
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  viewNoteDetail(id: string) {
  }
  
  decodeText(text:any){
    if(text == ''){
      return text
    }else{
      return this.encryptionDecryptionService.decrypt(text)
    }
  }

  downloadPdf(noteId:any): void {
    this.noteService.downloadPdf(noteId).subscribe((pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  printPdf(noteId:any): void {
    this.noteService.downloadPdf(noteId).subscribe((pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const pdfWindow = window.open(url, '_blank'); // Open PDF in a new tab
      pdfWindow?.focus();
      pdfWindow?.print();
      window.URL.revokeObjectURL(url); // Cleanup
    });
  }
}