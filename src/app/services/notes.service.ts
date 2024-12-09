import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }
  
  private apiUrl = environment.apiUrl; // replace with your API URL

  getSectionNotes(dataId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes?data_id=${dataId}`);
  }

  addPatientNotes(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes/add`, body);
  }

  deleteNoteItem(id:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes?id=${id}`);
  }

  getDiagnoses(page: number, limit: number, search: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search',search);

    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.apiUrl}/notes/diagonosisList`, { params });
  }


  getMedication(page: number, limit: number, search: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search',search);

    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.apiUrl}/notes/medicationList`, { params });
  }


  getcptcodeList(page: number, limit: number, search: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search',search);

    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.apiUrl}/notes/cptcodeList`, { params });
  }

  addHistoryNotes(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes/history`, body);
  }

  getHistoryNotes(dataId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/history?user_id=${dataId}`);
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/notes/downloadpdf?id=${id}`, {
      responseType: 'blob', // Receive binary data
    });
  }

  getHistoryNotesById(dataId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/history/${dataId}`);
  }
}
