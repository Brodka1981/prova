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

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})


export class ContattiComponent implements OnInit {
  persone: any
  persona: any
  displayedColumns: string[] = ['nome', 'email', 'rovescio','deleteAction'];
  displayedColumnFilters: string[] = ['nome-filter','email-filter'];
  dialogRef: MatDialogRef<ConfirmationDialog> | undefined;
  dialogInserisciRef: MatDialogRef<HomeComponent> | undefined;
  dataSource = new MatTableDataSource() // MatTableDataSource supporta filtri e paginazione

  nomeFilter = new FormControl(''); // il valore del filtro nome lo prendo da qua
  emailFilter = new FormControl(''); // il valore del filtro email lo prendo da qua
  filterValues = { //inizializzo il Json base dei filtri
    nome: '',
    email:''
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator | null; // serve per recuperare il riferimento al paginatore
  @ViewChild(MatSort) sort!: MatSort | null; // serve per recuperare il riferimento all'ordinatore
// Additional 'filter' column list

  constructor(private servizioProva: ServizioProvaService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.servizioProva.getPersone().subscribe((data: any) => {
      this.dataSource.data=Object.keys(data).map((key)=>{
        data[key]['id']=key;
        return data[key]
      });
      this.dataSource.filterPredicate = this.createFilter(); //Imposto come devono funzionare i filtri
    })

    this.nomeFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
      .subscribe(
        nome => {
          this.filterValues.nome = nome!;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )

    this.emailFilter.valueChanges //quando il filtro cambia gli vado a mettere il valore
    .subscribe(
      email => {
        this.filterValues.email = email!;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )

    this.servizioProva.data$.subscribe(res =>
      {
        if(res=='aggiorna') // serve quando viene forzato l'aggiornamento da un componente esterno
        {
          this.servizioProva.getPersone().subscribe((data: any) => {
          this.dataSource.data=Object.keys(data).map((key)=>{
            data[key]['id']=key;
            return data[key]
          });
        })
        }
      }
      )
  }

  ngAfterViewInit() { // qui invece che in ngOnInit() perché in questo evento siamo sicuri che il paginatore e l'ordinatore ci sono
    this.dataSource.paginator = this.paginator // serve per la paginazione
    this.dataSource.sort = this.sort;  // serve per ordinare
  }

  createFilter(): (data: any, filter: string) => boolean { // funzione che combina i vari filtri
    let filterFunction = function(data: { nome: string; email: string; }, filter: string): boolean {
      return data.nome.toLowerCase().indexOf(JSON.parse(filter).nome.toLowerCase()) !== -1
          && data.email.toString().toLowerCase().indexOf(JSON.parse(filter).email.toLowerCase()) !== -1
    }
    return filterFunction;
  }

  onInsertPersona()
  {
    this.dialogInserisciRef = this.dialog.open(HomeComponent);
  }

  onDeletePersona(id: string){

    this.dialogRef = this.dialog.open(ConfirmationDialog);
    this.dialogRef.componentInstance.confirmMessage = "Sei sicuro di voler cancellare?"

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) { //dialog conferma

        this.servizioProva.deletePersona(id).subscribe(data=>{
          // Dopo aver cancellato una persona richiamo il servizio GetPersone per aggiornare la vista
          this.servizioProva.getPersone().subscribe((data: any) => {
            this.dataSource.data=Object.keys(data).map((key)=>{
              data[key]['id']=key;
              return data[key]
            });
          })
          // se avevamo aperto il dettaglio del contatto selezionato ridirigiamo togliendo il dettaglio
          if(this.router.url.includes(id)){
            this.router.navigate(['sidebarcontatti']);
          }

        })

      }
    });
  }
}

