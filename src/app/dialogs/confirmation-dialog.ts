import { Component, Input } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>) {}

   confirmMessage:string | undefined;
}
