import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddModalComponent } from './add-modal/add-modal.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { NotesService } from 'src/app/services/notes.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SignOffComponent } from './sign-off/sign-off.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notesadd',
  templateUrl: './notesadd.component.html',
  styleUrls: ['./notesadd.component.scss'],
})
export class NotesaddComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notesService: NotesService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  notesForm!: FormGroup;
  isFieldDisabled = true;
  diagnosisList: any[] = [];
  currentPage: number = 1;
  limit: number = 20;
  loading: boolean = false;
  searchQuery: string = '';
  searchSubject: Subject<string> = new Subject();
  patientSelectedIds: number[] = [];
  // tableData: any[] = []; // To hold the table data
  tableData: Array<any> = [];
  textAreaData: any = '';
  diagnosisData = [];
  patientId: string | null = null;
  editNoteId: string | null = null;
  medicationData = [];
  cptData = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.patientId = params['patientId'];
      this.editNoteId = params['notesId'];
    });

    this.notesForm = this.fb.group({
      chiefComplaint: ['', [Validators.required, Validators.minLength(3)]],
      history: ['', [Validators.required, Validators.minLength(3)]],
      ros: ['', [Validators.required, Validators.minLength(3)]],
      social_history: ['', [Validators.required, Validators.minLength(3)]],
      allergies: ['', [Validators.required, Validators.minLength(3)]],
      currentMedication: ['', [Validators.required, Validators.minLength(3)]],
      physical: ['', [Validators.required, Validators.minLength(3)]],
      plan: ['', [Validators.required, Validators.minLength(3)]],
      weight: [''],
      height: [''],
      temp: [''],
      bpSys: [''],
      bpDia: [''],
      pulse: [''],
      rr: [''],
      bmi: [''],
      date: [new Date().toLocaleDateString()],
    });

    this.getDiagnosis();

    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged() // Prevent duplicate searches
      )
      .subscribe((search) => {
        this.searchQuery = search;
        this.currentPage = 1; // Reset page for new search
        this.diagnosisList = []; // Clear existing items
        this.getDiagnosis();
      });

    if (this.editNoteId) {
      this.notesService.getHistoryNotesById(this.editNoteId).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notesForm.patchValue({
              chiefComplaint: res.data.chief_complaint,
              history: res.data.history_illness,
              ros: res.data.ros,
              social_history: res.data.social_history,
              allergies: res.data.allergies,
              currentMedication: res.data.medication,
              physical: res.data.physical_details,
              plan: res.data.plan,
            });
            this.tableData = res.data.physical_exam;
            if (res.data.diagnosis.length > 0) {
              this.patientSelectedIds = res.data.diagnosis
                .filter((e1: any) => e1._id != null)
                .map((e1: any) => e1._id);

              this.diagnosisData = res.data.diagnosis;
              this.textAreaData = res.data.diagnosis
                .map((item1: any) => `${item1.code}: ${item1.desc}`)
                .join('\n');

              this.diagnosisList = [
                ...new Set([...this.diagnosisList, ...this.diagnosisData]),
              ];
            }
            this.medicationData = res.data.medicationList;
            this.cptData = res.data.cptCode;
          }
        },
        (error) => {
          console.error('Error fetching diagnoses:', error);
        }
      );
    }
  }

  openModal(elementId: any, noteData: any = '') {
    const modalRef = this.modalService.open(AddModalComponent, { size: 'lg' });
    modalRef.componentInstance.noteType = elementId;
    console.log(`noteData-1`, this.medicationData);
    if (elementId == 'currentMedication') {
      modalRef.componentInstance.noteData = this.medicationData;
    } else {
      modalRef.componentInstance.noteData = noteData;
    }
    modalRef.result
      .then((res: any) => {
        if (res) {
          const patchObj: any = {};
          if (res.noteType != 'currentMedication')
            patchObj[res.noteType] = res.notes;
          else {
            let textAreaData = res.notes
              .map((item1: any) => `${item1.PsnDrugDescription}`)
              .join('\n');
            patchObj[res.noteType] = textAreaData;
            this.medicationData = res.notes;
          }
          this.notesForm.patchValue(patchObj);
          console.log(`noteData-2`, this.medicationData);
        }
      })
      .catch((reason) => console.log('Modal dismissed:', reason));
  }

  getControl(controlName: string): AbstractControl | null {
    return this.notesForm.get(controlName);
  }

  getDiagnosis(): void {
    this.loading = true;
    this.notesService
      .getDiagnoses(this.currentPage, this.limit, this.searchQuery)
      .subscribe(
        (response: any) => {
          if (this.currentPage === 1) {
            this.diagnosisList = response.data.data; // Replace items on new search
          } else {
            this.diagnosisList = [...this.diagnosisList, ...response.data.data]; // Append items for scrolling
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching diagnoses:', error);
          this.loading = false;
        }
      );
  }

  onSearch(search: any): void {
    this.searchSubject.next(search.term); // Pass search query to the debounced handler
  }

  loadMoreItems(): void {
    this.currentPage++;
    this.getDiagnosis();
  }

  onSelectionChange(item: any = []): void {
    this.diagnosisData = [];
    this.textAreaData = item
      .map((item1: any) => `${item1.code}: ${item1.desc}`)
      .join('\n');
    this.diagnosisData = item;
    // Handle selection change
  }

  removeItem(item: any): void {
    console.log(`item`, item);
    this.patientSelectedIds = this.patientSelectedIds.filter(
      (id) => id !== item._id
    );
    this.diagnosisData = this.diagnosisData.filter(
      (diagnosis: any) => diagnosis._id !== item._id
    );
    this.diagnosisList = [
      ...new Set([...this.diagnosisList, ...this.diagnosisData]),
    ];
    this.textAreaData = this.diagnosisData
      .map((item1: any) => `${item1.code}: ${item1.desc}`)
      .join('\n');
  }

  updateTableEntry(): void {
    const entry = { date: this.notesForm.value.date, ...this.notesForm.value };
    const allowedFields = [
      'date',
      'weight',
      'height',
      'temp',
      'bpSys',
      'bpDia',
      'pulse',
      'rr',
      'bmi',
    ];
    const filteredEntry = Object.fromEntries(
      Object.entries(entry).filter(([key]) => allowedFields.includes(key))
    );
    if (filteredEntry['weight'] && filteredEntry['height']) {
      const weight = parseFloat(filteredEntry['weight'].toString()); // Convert weight to a number
      const height = parseFloat(filteredEntry['height'].toString()); // Convert height to a number

      // BMI Formula for weight in pounds (lb) and height in inches (in)
      const bmi = (weight * 703) / height ** 2;

      // Update BMI in form control and filtered entry
      filteredEntry['bmi'] = bmi.toFixed(2);
      this.notesForm.get('bmi')?.setValue(bmi.toFixed(2)); // Round to 2 decimal places
    }
    const existingIndex = this.tableData.findIndex(
      (item) => item.date === filteredEntry['date']
    );

    if (existingIndex !== -1) {
      this.tableData[existingIndex] = filteredEntry;
    } else {
      this.tableData.push(filteredEntry);
    }
  }

  openSignOffModal() {
    console.log(this.notesForm.valid,`notesForm`, this.notesForm, );
    if (this.notesForm.valid) {
      const modalRef = this.modalService.open(SignOffComponent, { size: 'md' });
      modalRef.componentInstance.noteData = this.diagnosisData;
      modalRef.componentInstance.cptData = this.cptData;
      modalRef.result
        .then((res: any) => {
          this.cptData = res;
          if (res && res.length > 0) {
            let reqData = {
              user_id: this.patientId,
              chief_complaint:
                this.notesForm.get('chiefComplaint')?.value || null,
              history_illness: this.notesForm.get('history')?.value || null,
              ros: this.notesForm.get('ros')?.value || null,
              social_history:
                this.notesForm.get('social_history')?.value || null,
              allergies: this.notesForm.get('allergies')?.value || null,
              medication:
                this.notesForm.get('currentMedication')?.value || null,
              plan: this.notesForm.get('plan')?.value || null,
              physical_exam: this.tableData,
              diagnosis: this.diagnosisData,
              cptCode: res,
              physical_details: this.notesForm.get('physical')?.value || null,
              medicationList: this.medicationData,
            };

            this.notesService.addHistoryNotes(reqData).subscribe({
              next: (response) => {
                if (response.statusCode == 200) {
                  console.log('Item added successfully:', response);
                  this.location.back();
                }
              },
              error: (error) => {
                console.error('Error adding item:', error);
                //this.isLoading = false;
              },
            });
          }
        })
        .catch((reason) => console.log('Modal dismissed:', reason));
    }else{
      console.log(`noteForm`, this.notesForm);
      this.notesForm.markAllAsTouched()
    }
  }
}
