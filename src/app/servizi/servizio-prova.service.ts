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
  private listaNazioni = ['italia','svizzera','germania','danimarca','spagna','serbia','bulgaria'];

  statusExpired = "Expired";                                       //SCADUTA
  statusOK = "Completed";                                          //OK (Esito positivo)
  statusOKPreDVO = "WaitingDVO";                                   //OK (Esito positivo Pre-DVO)
  statusKO = "LegalPersonManualCheckKO";                           //KO (Esito negativo)
  statusKOPreDVO = "PreflightLegalPersonCheckManualKO";            //KO (Esito negativo Pre-DVO)
  statusDaLavorare = "WaitingLegalPersonManualCheck";              //DA LAVORARE
  statusPresaInCarico = "WaitingLegalPersonManualCheckInProgress"; //PRESA IN CARICO
  statusAttesaNuovaDoc = "WaitingLegalPersonManualUpload"          //FORNISCI NUOVA DOCUMENTAZIONE
  statusDaLavorarePreDVO = "PreflightLegalPersonManualCheck";      //DA LAVORARE (Pre-DVO)
  statusKO2 = "LegalPersonCheckKO";                                 //KO Pratiche.it

  renderedStatusExpired = "Scaduta";                               //SCADUTA
  renderedStatusOK = "OK (Esito positivo)";                        //OK (Esito positivo)
  renderedStatusOKPreDVO = "OK (Esito positivo Pre-DVO)";          //OK (Esito positivo Pre-DVO)
  renderedStatusKO = "KO (Esito negativo)";                        //KO (Esito negativo)
  renderedStatusKOPreDVO = "KO (Esito negativo Pre-DVO)";          //KO (Esito negativo Pre-DVO)
  renderedStatusDaLavorare = "Da Lavorare";                        //DA LAVORARE
  renderedStatusPresaInCarico = "Presa In Carico";                 //PRESA IN CARICO
  renderedStatusAttesaNuovaDoc = "Nuova Documentazione";           //FORNISCI NUOVA DOCUMENTAZIONE
  renderedStatusDaLavorarePreDVO = "Da Lavorare (Pre-DVO)";        //DA LAVORARE (Pre-DVO)
  renderedStatusKO2 = "KO Pratiche.it";                             //KO Pratiche.it

  // The index of this array is an implicit status order, for sorting purposes.
  statuses = [
      { raw: this.statusDaLavorarePreDVO, display: this.renderedStatusDaLavorarePreDVO },
      { raw: this.statusDaLavorare, display: this.renderedStatusDaLavorare },
      { raw: this.statusPresaInCarico, display: this.renderedStatusPresaInCarico },
      { raw: this.statusOKPreDVO, display: this.renderedStatusOKPreDVO },
      { raw: this.statusOK, display: this.renderedStatusOK },
      { raw: this.statusAttesaNuovaDoc, display: this.renderedStatusAttesaNuovaDoc },
      { raw: this.statusKOPreDVO, display: this.renderedStatusKOPreDVO },
      { raw: this.statusKO, display: this.renderedStatusKO },
      { raw: this.statusKO2, display: this.renderedStatusKO2 },
      { raw: this.statusExpired, display: this.renderedStatusExpired }
  ];

  subjectTypes = [
    { raw: "PF", display: "Persona Fisica" },
    { raw: "PG", display: "Azienda" },
    { raw: "DI", display: "Ditta Indiv." },
    { raw: "LP", display: "Libero Profess." },
    { raw: "PA", display: "Pubblica Amm." },
    { raw: "NP", display: "No Profit" }
  ];

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

  getNazioni(){
    return this.listaNazioni;
  }

  getTransactionsList(){
    return this.http.post('https://localhost:44320/PecConsumer/Search',{Channel: "PecConsumer"});
  }

  getTransactionsDetail(id: string){
    return this.http.post('https://localhost:44320/PecConsumer/Detail',{transactionId: id});
  }

  takeTransaction(id: string, force: any){
    return this.http.post('https://localhost:44320/PecConsumer/Take',{transactionId: id, force: force});
  }

  getMotiviKo(){
    return this.http.post('https://localhost:44320/PecConsumer/ListMotiviKO',{Channel: "PecConsumer"});
  }

  getOperatorProfile(){
    return this.http.post('https://localhost:44320/PecConsumer/OperatorProfile',{Channel: "PecConsumer"});
  }

  renderDate(date: any) {
    if(date==='' || date==null)
      return ''
    return new Date(date).toLocaleString();
  }

  renderStatus(status: any) {
    var rendered = this.statuses.filter(function (s) {
        return s.raw === status;
    });

    if (rendered.length > 0)
        return rendered[0].display;
    else
        return '???';
  }

  renderSubjectType(type: any) {
    var rendered = this.subjectTypes.filter(function (s) {
        return s.raw === type;
    });

    if (rendered.length > 0)
        return rendered[0].display;
    else
        return '???';
  }
}
