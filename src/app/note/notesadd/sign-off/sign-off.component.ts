import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-sign-off',
  templateUrl: './sign-off.component.html',
  styleUrls: ['./sign-off.component.scss']
})
export class SignOffComponent implements OnInit{
  diagnosisList: any[] = [];
  currentPage: number = 1;
  limit: number = 20;
  searchQuery: string = '';
  searchSubject: Subject<string> = new Subject();
  patientSelectedIds: number[] = [];
  loading: boolean = false;
  diagnosisData = [];
  tableData: Array<any> = [];
  @Input() noteData!: { code: string }[];
  @Input() cptData !: any;;

  constructor(public activeModal: NgbActiveModal,private noteService: NotesService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getDiagnosis();

    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged() // Prevent duplicate searches
    ).subscribe(search => {
      this.searchQuery = search;
      this.currentPage = 1; // Reset page for new search
      this.diagnosisList = []; // Clear existing items
      this.getDiagnosis();
    });

    if(this.cptData.length > 0){
      this.patientSelectedIds = this.cptData
      .filter((e1:any) => e1._id != null)
      .map((e1:any) => e1._id);
    this.diagnosisData = this.cptData;
    this.diagnosisList = [...new Set([...this.diagnosisList, ...this.diagnosisData])];
    this.diagnosisData.map((e1:any,index:any)=>{
      this.tableData[index] = {
        cpt: e1.code,
        icd1: this.noteData.length > 0 ? this.noteData[0]?.code : null,
        icd2: this.noteData.length > 1 ? this.noteData[1]?.code : null,
        icd3: this.noteData.length > 2 ? this.noteData[2]?.code : null,
        icd4: this.noteData.length > 3 ? this.noteData[3]?.code : null
      };
    });
    }

  }

  handleClose() {
    this.activeModal.dismiss('Modal closed by user');
  }

  getDiagnosis(): void {
    this.loading = true;
    this.noteService.getcptcodeList(this.currentPage, this.limit, this.searchQuery)
      .subscribe((response: any) => {
        if (this.currentPage === 1) {
          this.diagnosisList = response.data.data; // Replace items on new search
        } else {
          this.diagnosisList = [...this.diagnosisList, ...response.data.data]; // Append items for scrolling
        }
        this.loading = false;
      }, error => {
        console.error('Error fetching diagnoses:', error);
        this.loading = false;
      });
  }

  onSearch(search: any): void {
    this.searchSubject.next(search.term); // Pass search query to the debounced handler
  }

  loadMoreItems(): void {
    this.currentPage++;
    this.getDiagnosis();
  }

  onSelectionChange(item:any=[]): void {
    this.diagnosisData = [];
    this.diagnosisData = item;

    this.diagnosisData.map((e1:any,index:any)=>{
      this.tableData[index] = {
        cpt: e1.code,
        icd1: this.noteData.length > 0 ? this.noteData[0]?.code : null,
        icd2: this.noteData.length > 1 ? this.noteData[1]?.code : null,
        icd3: this.noteData.length > 2 ? this.noteData[2]?.code : null,
        icd4: this.noteData.length > 3 ? this.noteData[3]?.code : null
      };
    });
  }

  removeItem(item: any): void {
    this.patientSelectedIds = this.patientSelectedIds.filter(
      (id) => id !== item._id
    );
    this.diagnosisData = this.diagnosisData.filter((diagnosis: any) => diagnosis._id !== item._id);
    this.tableData=[]
    this.diagnosisList = [...new Set([...this.diagnosisList, ...this.diagnosisData])];
    this.diagnosisData.map((e1:any,index:any)=>{
      this.tableData[index] = {
        cpt: e1.code,
        icd1: this.noteData.length > 0 ? this.noteData[0]?.code : null,
        icd2: this.noteData.length > 1 ? this.noteData[1]?.code : null,
        icd3: this.noteData.length > 2 ? this.noteData[2]?.code : null,
        icd4: this.noteData.length > 3 ? this.noteData[3]?.code : null
      };
    });
  }

  handleSubmit(){
    const modalData = {};
    this.activeModal.close(this.diagnosisData);
  }
}
