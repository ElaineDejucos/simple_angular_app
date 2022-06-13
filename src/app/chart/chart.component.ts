import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class  ChartComponent implements OnInit {
  public chartData: Object[] = [];
  public primaryXAxis!: Object; 
  public title!: Object;

  constructor(
    private api: ApiService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllInformation();
  }

  getAllInformation(){
    this.api.getDetails()
    .subscribe({
      next:(res)=>{
        this.onPlotting(res);
      },
      error:()=>{
        this._snackBar.open("Error fetching the records.", 'Close', {
          duration: 1500,
        });
      }
    })
  }

  reloadCurrentPage() {
    window.location.reload();
   }

  onPlotting(data: any){
    console.log(data);
    /**
     * Get the xName and yName for the graph (xName = count; yName = country)
     */
    let intlTravel: any = [];
    let questions: any = [];
    let totalNo;
    let totalYes;

    data.forEach((val: any) => {
      questions.push(val.questionList);
    })
  
    questions.forEach((val: any) => {
      val.forEach((item: any) => {
        if (item.questionNum == 6){
          intlTravel.push(item.description);
        }
      })
    })
    
    totalNo = intlTravel.filter((item:any) => { return item == "No"});
    totalYes = intlTravel.filter((item:any) => { return item == "Yes"});

    intlTravel.forEach((item: any) => {
      switch (item){
        case "No":
          this.chartData.push({
            yAxis: totalNo.length,
            xAxis: item
          })
          break;

        case "Yes":
          this.chartData.push({
            yAxis: totalYes.length,
            xAxis: item
          })
          break;
      }
      
    })

    this.primaryXAxis = { valueType: 'Category' };
    this.title = 'International Travel';
  }

}
