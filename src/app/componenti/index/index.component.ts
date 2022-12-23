import { Component, OnInit, ViewChild } from '@angular/core';
import { ServizioProvaService } from 'src/app/servizi/servizio-prova.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation-dialog';
import { HomeComponent } from '../home/home.component';
import { Router  } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort} from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { DettaglioComponent } from '../dettaglio/dettaglio.component';
import * as XLSX from "xlsx";
import { TableUtil } from "./tableUtil";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  dataSource = new MatTableDataSource<PeriodicElement>() // MatTableDataSource supporta filtri e paginazione
  dialogRef: MatDialogRef<ConfirmationDialog> | undefined;

  displayedColumns: string[] = ['creationDate', 'verificationKoDate', 'motivoKo','transactionId','transactionStatus','dettagli','prendiInCarico','companyName','subjectType','vatNumber','companyFiscalCode','numberOfRequests'
  ,'numberOfAccounts','escalation','operatorAccount'];

  displayedColumnFilters: string[] = ['creationDate-filter','verificationKoDate-filter','motivoKo-filter','transactionId-filter','transactionStatus-filter','dettagli-filter','prendiInCarico-filter','companyName-filter',
  'subjectType-filter','vatNumber-filter','companyFiscalCode-filter','numberOfRequests-filter','numberOfAccounts-filter','escalation-filter','operatorAccount-filter'];

  creationDateFilter = new FormControl('');
  motivoKoFilter = new FormControl('');
  transactionIdFilter = new FormControl('');
  transactionStatusFilter = new FormControl('');
  companyNameFilter = new FormControl('');
  subjectTypeFilter = new FormControl('');
  vatNumberFilter = new FormControl('');
  companyFiscalCodeFilter = new FormControl('');
  escalationFilter = new FormControl('');
  operatorAccountFilter = new FormControl('');
  filterValues = { //inizializzo il Json base dei filtri
    creationDate: '',
    motivoKo:'',
    transactionId:'',
    transactionStatus:'',
    companyName:'',
    subjectType:'',
    vatNumber:'',
    companyFiscalCode:'',
    escalation:'',
    operatorAccount:''
  };

  operator: any;
  motiviKo = [ {key: "", value: "Tutti" } ];
  dialogDettaglioRef: MatDialogRef<DettaglioComponent> | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator | null; // serve per recuperare il riferimento al paginatore
  @ViewChild(MatSort) sort!: MatSort | null; // serve per recuperare il riferimento all'ordinatore
  constructor(public servizioProva: ServizioProvaService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.servizioProva.getMotiviKo().subscribe((data: any) => {
      this.motiviKo=data;
    })

    this.servizioProva.getOperatorProfile().subscribe((data: any) => {
      this.operator = data;
      console.log(this.operator);
    })

    this.servizioProva.getTransactionsList().subscribe((data: any) => {
      this.dataSource.data = data.result;
      this.dataSource.filterPredicate = this.createFilter(); //Imposto come devono funzionare i filtri
      console.log(this.dataSource.data);
    })

    this.motivoKoFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.motivoKo = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )

    this.transactionIdFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.transactionId = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

      this.transactionStatusFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.transactionStatus = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
      })

      this.companyNameFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.companyName = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        })

      this.subjectTypeFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.subjectType = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
      })

      this.vatNumberFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.vatNumber = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        })

      this.companyFiscalCodeFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.companyFiscalCode = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        })

      this.escalationFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.escalation = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        })

      this.operatorAccountFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        val => {
          this.filterValues.operatorAccount = val!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        })

  }

  ngAfterViewInit() { // qui invece che in ngOnInit() perché in questo evento siamo sicuri che il paginatore e l'ordinatore ci sono
    this.dataSource.paginator = this.paginator // serve per la paginazione
    this.dataSource.sort = this.sort;  // serve per ordinare
  }

  createFilter(): (data: any, filter: string) => boolean { // funzione che combina i vari filtri
    let filterFunction = function(data: { transactionId: string; companyName: string; subjectType:string; motivoKo:string; transactionStatus:string; vatNumber:string; companyFiscalCode:string; escalation:string; operatorAccount:string }, filter: string): boolean {

      var dataOpAcc='';
      if(data.operatorAccount!=null)
      {
        dataOpAcc = data.operatorAccount;
      }

      return data.transactionId.toString().toLowerCase().indexOf(JSON.parse(filter).transactionId.toString().toLowerCase()) !== -1
          && data.companyName.toString().toLowerCase().indexOf(JSON.parse(filter).companyName.toString().toLowerCase()) !== -1
          && data.vatNumber.toString().toLowerCase().indexOf(JSON.parse(filter).vatNumber.toString().toLowerCase()) !== -1
          && data.companyFiscalCode.toString().toLowerCase().indexOf(JSON.parse(filter).companyFiscalCode.toString().toLowerCase()) !== -1
          && dataOpAcc.toString().toLowerCase().indexOf(JSON.parse(filter).operatorAccount.toString().toLowerCase()) !== -1
          && data.motivoKo.toString().toLowerCase().indexOf(JSON.parse(filter).motivoKo.toLowerCase()) !== -1
          && data.escalation.toString().toLowerCase().indexOf(JSON.parse(filter).escalation.toLowerCase()) !== -1
          && (JSON.parse(filter).subjectType.length===0 || JSON.parse(filter).subjectType.includes(data.subjectType))
          && (JSON.parse(filter).transactionStatus.length===0 || JSON.parse(filter).transactionStatus.includes(data.transactionStatus))
    }
    return filterFunction;
  }



  renderEscalation(e: any) {
    return (e == 'true') ? 'SI' : '';
  }

  onOpenDettaglio(transactionId: any)
  {
    this.dialogDettaglioRef = this.dialog.open(DettaglioComponent,{
        height: '90%',
        width: '90%',
        data: { transactionId: transactionId },
    });
  }

  onPrendiInCarico(transactionId: any, owningOperator: string, modale: boolean)
  {
    if(modale){ // c'é bisogno della modale perché in carico ad un altro operatore
      this.dialogRef = this.dialog.open(ConfirmationDialog);
      this.dialogRef.componentInstance.confirmMessage = "La Richiesta è già in carico all'Operatore " + "<b>" + owningOperator + "</b>.<br>Si desidera proseguire con la Presa In Carico?"
      this.dialogRef.afterClosed().subscribe(result => {
        if(result) { //dialog conferma
          this.servizioProva.takeTransaction(transactionId, true).subscribe((data: any)=>{
            console.log(data);
          })
        }
      });
    } else {
      this.servizioProva.takeTransaction(transactionId, false).subscribe((data: any) =>{
        console.log(data);
        if(data.success==false)
        {
          this.dialogRef = this.dialog.open(ConfirmationDialog);
          this.dialogRef.componentInstance.tipo = "errore";
          this.dialogRef.componentInstance.titolo = "Errore";
          this.dialogRef.componentInstance.confirmMessage = data.message + ": " + data.details;
        }
      })
    }
  }

  exportArray() {
    const onlyNameAndSymbolArr: Partial<PeriodicElement>[] = this.dataSource.data.map(x => ({
      creationDate: this.servizioProva.renderDate(x.creationDate),
      verificationKoDate: this.servizioProva.renderDate(x.verificationKoDate),
      motivoKo: x.motivoKo,
      transactionId: x.transactionId,
      transactionStatus: this.servizioProva.renderStatus(x.transactionStatus),
      companyName: x.companyName,
      subjectType: this.servizioProva.renderSubjectType(x.subjectType),
      vatNumber: x.vatNumber,
      companyFiscalCode: x.companyFiscalCode,
      numberOfRequests: x.numberOfRequests,
      numberOfAccounts: x.numberOfAccounts,
      escalation: x.escalation,
      operatorAccount: x.operatorAccount
    }));
    TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
  }

}

export interface PeriodicElement {
  creationDate: string;
  verificationKoDate: string;
  motivoKo: string;
  transactionId: string;
  transactionStatus: string;
  dettagli: string;
  prendiInCarico: string;
  companyName: string;
  subjectType: string;
  vatNumber: string;
  companyFiscalCode: string;
  numberOfRequests: string;
  numberOfAccounts: string;
  escalation: string;
  operatorAccount: string;
}
