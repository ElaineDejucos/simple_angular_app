import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddInformationComponent } from './addinformation/addinformation.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsComponent } from './details/details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartModule } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';
  displayedColumns: string[] = ['fullName', 'gender', 'citizenship', 'questionList'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private addInformation: MatDialog, 
    private api: ApiService,
    private details: MatDialog,
    private _snackBar: MatSnackBar
    ){}

  ngOnInit(): void {
    this.getAllInformation();
  }
  
  openDialog() {
    this.addInformation.open(AddInformationComponent, {
      width: "30%"
    }).afterClosed().subscribe(val => {
      if (val === 'save'){
        this.getAllInformation();
      }
    })
  }

  openDetails(row: any){
    this.details.open(DetailsComponent, {
      data: row.questionList,
      width: "30%"
    })
  }

  getAllInformation(){
    this.api.getDetails()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        this._snackBar.open("Error fetching the records.", 'Close', {
          duration: 1500,
        });
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
