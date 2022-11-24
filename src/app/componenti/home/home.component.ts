import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServizioProvaService } from 'src/app/servizi/servizio-prova.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeForm = new FormGroup({
      nome: new FormControl(),
      email: new FormControl(),
      rovescio: new FormControl()
  })

  constructor(private service : ServizioProvaService, public dialogRef: MatDialogRef<HomeComponent>) { }

  ngOnInit(): void {
    this.homeForm= new FormGroup({
        nome : new FormControl('Luca', Validators.required),
        email: new FormControl(null,[Validators.required, Validators.email]),
        rovescio: new FormControl('duemani')
    })


  }

  onSubmit(){
    this.service.insertPersona(
      { nome: this.homeForm.value.nome, email:this.homeForm.value.email, rovescio:this.homeForm.value.rovescio}).subscribe(data =>
        {
          console.log(data)
          // Dopo aver inserito una persona richiamo il servizio GetPersone per aggiornare la vista
          this.service.aggiornaPersone('aggiorna');
          this.dialogRef.close();
        });
  }

}
