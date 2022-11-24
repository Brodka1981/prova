import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServizioProvaService {
  private data = new BehaviorSubject('default');
  data$ = this.data.asObservable();
  private apiUrlNoExt = 'https://corso-angular-2b577-default-rtdb.europe-west1.firebasedatabase.app/persone';
  private apiUrl = 'https://corso-angular-2b577-default-rtdb.europe-west1.firebasedatabase.app/persone' + '.json';

  constructor(private http: HttpClient) { }

  aggiornaPersone(data: string) {
    this.data.next(data)
  }

  insertPersona(data: {}){
    return this.http.post(this.apiUrl,data);
  }

  getPersone(){
    return this.http.get(this.apiUrl);
  }

  deletePersona(id: string)
  {
    return this.http.delete(`${this.apiUrlNoExt}/${id}.json`);
  }

  getPersona(id: string)
  {
    return this.http.get(`${this.apiUrlNoExt}/${id}.json`);
  }

  patchPersona(id: string, data: {})
  {
    return this.http.patch(`${this.apiUrlNoExt}/${id}.json`, data);
  }
}
