import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent implements OnInit{
  @Output() close = new EventEmitter<void>();

  diagnosisList: any[] = [];
  currentPage: number = 1;
  limit: number = 20;
  searchQuery: string = '';
  searchSubject: Subject<string> = new Subject();
  patientSelectedIds: number[] = [];
  loading: boolean = false;
  diagnosisData = [];

  notes:any = [];
  @Input() noteType!: string;
  @Input() noteData!: any;

  itemForm!: FormGroup;
  isLoading = false;
  textAreaData:any = '';
  checkedDonorItems: string[] = [];
  isModalOpen = false; // Tracks modal state
  patientList = [];
  row=8;

  constructor(public activeModal: NgbActiveModal,private noteService: NotesService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.fetchPatients(this.noteType);
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });


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

   if(this.noteType =='currentMedication'){
    this.row = 20
    this.patientSelectedIds = this.noteData
    .filter((e1:any) => e1._id != null)
    .map((e1:any) => e1._id);
    this.diagnosisData = this.noteData;

    this.textAreaData = this.noteData.map((item1:any) => `${item1.PsnDrugDescription}`).join('\n');
    this.diagnosisList = [...new Set([...this.diagnosisList, ...this.diagnosisData])];
   }else if(this.noteData != '')
    { 
     this.checkedDonorItems = this.noteData.split('\n').filter((item:any) => item.trim() !== '');
     this.textAreaData = this.checkedDonorItems.join('\n');
    }
  }

  handleClose() {
    this.activeModal.dismiss('Modal closed by user');
  }

  handleSubmit(){
    const modalData = {
      noteType: this.noteType, // Example data from the modal
      notes: this.textAreaData,
    };

    if(this.noteType == 'currentMedication'){
      modalData.notes = this.diagnosisData
    }
    this.activeModal.close(modalData);
  }

  fetchPatients(dataId:any): void {
    // Fetch data from an API
    this.noteService.getSectionNotes(dataId).subscribe({
      next: (response) => {
        if(response?.statusCode == 200){
          console.log('Item added successfully:', response);
          this.notes = response.data;
        }
      },
      error: (error) => {
        console.error('Error adding item:', error);
      }
    }
  )
  }
  
  handleSelectDonor(item: any): void {
    if (this.checkedDonorItems.includes(item.description)) {
      this.checkedDonorItems = this.checkedDonorItems.filter(
        (desc) => desc !== item.description
      );
    } else {
      this.checkedDonorItems.push(item.description);
    }

    this.textAreaData = this.checkedDonorItems.join('\n');
  }
  
  getControl(controlName: string): AbstractControl | null {
    return this.itemForm.get(controlName);
  }

  onAddItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched(); // Highlight validation errors
      return;
    }

    this.isLoading = true; // Show loading indicator if needed
    const formData = this.itemForm.value;
    formData.data_id = this.noteType;

    // Example API call
    this.noteService.addPatientNotes(formData).subscribe({
      next: (response) => {
        if(response.statusCode == 200){
          console.log('Item added successfully:', response);
          this.isLoading = false;
          this.itemForm.reset(); // Reset form after success
          this.fetchPatients(this.noteType)
        }
      },
      error: (error) => {
        console.error('Error adding item:', error);
        this.isLoading = false;
      }
    });
  }

  openModal(item: any): void {
    //this.selectedItem = item;
    this.isModalOpen = true; // Open the modal
  }

  closeModal(): void {
    this.isModalOpen = false; // Close the modal
  }

  confirmDelete(): void {
    // Perform your delete operation here
    this.closeModal(); // Close the modal after deletion
  }


  getDiagnosis(): void {
    this.loading = true;
    this.noteService.getMedication(this.currentPage, this.limit, this.searchQuery)
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
    this.textAreaData = item.map((item1:any) => `${item1.PsnDrugDescription}`).join('\n');
    this.diagnosisData = item;
    // Handle selection change
  }

  removeItem(item: any): void {
    console.log(`item`, item);
    this.patientSelectedIds = this.patientSelectedIds.filter(
      (id) => id !== item._id
    );
    this.diagnosisData = this.diagnosisData.filter((diagnosis: any) => diagnosis._id !== item._id);
    this.diagnosisList = [...new Set([...this.diagnosisList, ...this.diagnosisData])];
    this.textAreaData =  this.diagnosisData.map((item1:any) => `${item1.PsnDrugDescription}`).join('\n');
  }

}
