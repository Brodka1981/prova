import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServizioProvaService } from 'src/app/servizi/servizio-prova.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation-dialog';


@Component({
  selector: 'app-contatto',
  templateUrl: './contatto.component.html',
  styleUrls: ['./contatto.component.css']
})
export class ContattoComponent implements OnInit {
  @Output() eventoCancella = new EventEmitter<string>()
  id:string | undefined
  persona:any
  isModifica:boolean | undefined
  dialogRef: MatDialogRef<ConfirmationDialog> | undefined;

  contattoForm = new FormGroup({
    nome: new FormControl(),
    email: new FormControl(),
    rovescio: new FormControl()
  })

  constructor(private route: ActivatedRoute, private servizioProva: ServizioProvaService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.id= this.route.snapshot.paramMap.get('id')!
    this.isModifica = !this.route.snapshot.paramMap.get('mod')? false : true;

    this.route.paramMap.subscribe((params: ParamMap)=>{
      this.id= params.get('id')!
      this.servizioProva.getPersona(this.id).subscribe((data: any) => {
        this.persona=data;
        if(this.isModifica)
        {
          this.contattoForm= new FormGroup({
            nome : new FormControl(this.persona.nome, Validators.required),
            email: new FormControl(this.persona.email,[Validators.required, Validators.email]),
            rovescio: new FormControl(this.persona.rovescio)
          })
        }
      })

    })
  }

  onDeletePersona() {
    this.dialogRef = this.dialog.open(ConfirmationDialog);
    this.dialogRef.componentInstance.confirmMessage = "Sei sicuro di voler cancellare?"

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        // do confirmation actions

        this.servizioProva.deletePersona(this.id!).subscribe(data=>{
          // Dopo aver cancellato una persona richiamo il servizio GetPersone per aggiornare la vista
          this.servizioProva.aggiornaPersone('aggiorna');
          this.router.navigate(['sidebarcontatti']);
        })

      }
    });
  }

  onModificaPersona(){
    this.router.navigate(['sidebarcontatti',this.id,1]);
  }

  onAnnulla(){
    this.router.navigate(['sidebarcontatti',this.id]);
  }

  onSubmit(){
    this.servizioProva.patchPersona(this.id! ,
      { nome: this.contattoForm.value.nome, email:this.contattoForm.value.email, rovescio:this.contattoForm.value.rovescio}).subscribe(data => {
        // Dopo aver modificato una persona richiamo il servizio GetPersone per aggiornare la vista
        this.servizioProva.aggiornaPersone('aggiorna');
        this.router.navigate(['sidebarcontatti',this.id]);
      });
  }
}
