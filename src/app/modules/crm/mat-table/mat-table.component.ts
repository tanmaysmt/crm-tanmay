import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { LeadTransferComponent } from '../dialogBox/lead-transfer/lead-transfer.component';
declare var toastr:any;
declare var Swal:any;
declare var $:any;
export interface States {
  name: string;
}

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.css']
})

export class MatTableComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(LeadTransferComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}