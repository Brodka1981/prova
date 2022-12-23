import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ServizioProvaService } from 'src/app/servizi/servizio-prova.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.css']
})
export class DettaglioComponent implements OnInit {
  channel: string | undefined;
  creationDate: string | undefined;
  transactionId: string | undefined;
  transactionType: string | undefined;
  transactionStatus: string | undefined;
  operatorAccount: string | undefined;
  numberOfRequests: string | undefined;
  numberOfAccounts: string | undefined;
  dataVerificationKO: string | undefined;
  koReason: string | undefined;
  gestioneOperatore: string | undefined;
  note: string | undefined;
  companyName: string | undefined;
  identificationSubjectType: string | undefined;
  companyFiscalCode: string | undefined;
  vatNumber: string | undefined;
  personName: string | undefined;
  personSurname: string | undefined;
  personFiscalCode: string | undefined;

  subjectAccounts: any;
  constructor(public dialogRef: MatDialogRef<DettaglioComponent>, public servizioProva: ServizioProvaService, @Inject(MAT_DIALOG_DATA) public data: {transactionId: string}) { }

  ngOnInit(): void {
    this.servizioProva.getTransactionsDetail(this.data.transactionId).subscribe((data: any) => {
      this.channel=data.result.channel;
      this.creationDate=this.servizioProva.renderDate(data.result.creationDate);
      this.transactionId=data.result.transactionId;
      this.transactionType=data.result.transactionType;
      this.transactionStatus=this.servizioProva.renderStatus(data.result.transactionStatus);
      this.operatorAccount=data.result.operatorAccount;
      this.numberOfRequests=data.result.numberOfRequests;
      this.numberOfAccounts=data.result.numberOfAccounts;
      this.subjectAccounts=data.result.subjectAccounts;

      if(data.result.dataVerificationInfo){
        this.dataVerificationKO=this.servizioProva.renderDate(data.result.dataVerificationInfo.dataVerificationKO);
      }
      this.koReason=data.result.koReason;
      this.gestioneOperatore=data.result.gestioneOperatore;
      this.note=data.result.note;
      this.companyName=data.result.companyName;
      this.identificationSubjectType = data.result.identificationSubjectType;
      this.companyFiscalCode = data.result.companyFiscalCode;
      this.vatNumber = data.result.vatNumber;
      this.personName = data.result.personName;
      this.personSurname = data.result.personSurname;
      this.personFiscalCode = data.result.personFiscalCode;

      this.subjectAccounts = Object.keys(this.subjectAccounts).map(v => ({
        key: v,
        value: this.subjectAccounts[v]
    }));
    console.log(data.result);

    })

  }

}
