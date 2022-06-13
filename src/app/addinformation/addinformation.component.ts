import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import countryList from './json/countries.json';
import questionaires from './json/questionaires.json';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Country {
  letter: string,
  names: string[]
}

export interface Questions {
  QuestionNo: number,
  PQuestionDescription: string,
  PQuestion: boolean,
  CQuestionDescription: string,
  CQuestion: boolean,
  PQuestionNo: string,
  QuestionType: string,
  QuestionOptions: Options[]
}

export interface Options {
  value: string,
  description: string
}

export interface ItemSelected{
  questionNum: number,
  questionDesc: string,
  value: string,
  description?: string
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
}

@Component({
  selector: 'app-addinformation',
  templateUrl: './addinformation.component.html',
  styleUrls: ['./addinformation.component.css']
})
export class AddInformationComponent implements OnInit {

  travelForm! : FormGroup;
  gender: string[] = ["Male", "Female"]

  // Questionaires
  questions: Questions[] = questionaires;
  selectedOption?: string[];

  //Country - Autocomplete
  countryForm = this._formBuilder.group({ countryGroup: '', });
  countries: Country[] = countryList;
  countryGroupOptions?: Observable<Country[]>;
  transpo!: { questionDesc: string; questionNum: number; };
  country!: { questionDesc: string; questionNum: number; };
  tAgent!: { questionDesc: string; questionNum: number; };
  travelAgent: string = '';

  constructor(
    private _formBuilder: FormBuilder, 
    private api: ApiService, 
    private dialogRef: MatDialogRef<AddInformationComponent>,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.countryGroupOptions = this.countryForm.get('countryGroup')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value || '')),
    );

    this.travelForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      citizenship: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    })
  }

  private selected: ItemSelected[] = [];
  private transportation: string[] = [];
  private _filterGroup(value: string): Country[] {
    if (value){
      return this.countries.map(group => ({letter: group.letter, names: _filter(group.names, value)})).filter(group => group.names.length > 0);
    }
    return this.countries;
  }

  /**
   * To get the value of the text area
   * @param value 
   */
  onEnter(value: string){
    if (value){
      this.transportation.push(value)
    }
  }

  setTransportation(questionDesc: string, questionNum: number){
    this.transpo = {
      questionDesc: questionDesc,
      questionNum: questionNum
    }
  }

  setCountry(questionDesc: string, questionNum: number){
    this.country = {
      questionDesc: questionDesc,
      questionNum: questionNum
    }
  }

  setTravelAgent(questionDesc: string, questionNum: number){
    this.tAgent = {
      questionDesc: questionDesc,
      questionNum: questionNum
    }
  }

  /**
   * To get the value entered in Travel Agent
   * @param value
   */
  onType(value: string, ){
    this.travelAgent = value;
  }

  /**
   * Questions answers
   * @param selectedVal 
   * @param questionNum 
   */
  selectedOpt(selectedVal: string, questionNum: number, ansDesc: string, questionDesc: string): void{
    var forUpdate = this.selected.filter(item => {
      return item.questionNum == questionNum
    }).length > 0 ? true : false;
    if (forUpdate){
      for (var x in this.selected){
        if (this.selected[x].questionNum == questionNum) {
          this.selected[x].value = selectedVal;
          this.selected[x].description = ansDesc
          break;
        }
      }
    }
    else {
      this.selected.push({
        questionNum: questionNum,
        questionDesc: questionDesc,
        value: selectedVal,
        description: ansDesc
      });
    }
  }

  showChild(itemQuestionNum: number): boolean{
    if (this.selected && this.selected.length > 0){
      for (var y in this.selected){
        var getQuestion6 = this.selected.filter(item => {
          return item.questionNum === itemQuestionNum && item.value === "y"
        }).length > 0 ? true : false;
        var getQuestion10 = this.selected.filter(item => {
          return item.questionNum === itemQuestionNum && item.value === "y"
        }).length > 0 ? true : false;
  
        if (getQuestion6 || getQuestion10){
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Saving information
   */
  saveInfo(){
    /**
     * Transportation
     */
    if (this.transportation && this.transportation.length > 0) {
      let transpo = this.transportation[this.transportation.length-1].split("\n")
      this.transportation = []
      transpo.forEach(item => {
        if (item != ''){
          this.transportation.push(item);
        }
      })
      this.travelForm.value.transportation = this.transportation;
      this.selected.push({
        questionNum: this.transpo.questionNum,
        questionDesc: this.transpo.questionDesc,
        value: "",
        description: this.transportation.join(', ')
      })
    }

    /**
     * Country
     */
    this.travelForm.value.country = this.countryForm.value
    let selCountry = this.travelForm.value.country.countryGroup;
    if (selCountry != ''){
      this.selected.push({
        questionNum: this.country.questionNum,
        questionDesc: this.country.questionDesc,
        value: "",
        description: selCountry
      })
    }

    /**
     * Travel Agent
     */
    let travelAgent = this.travelAgent;
    if (travelAgent != ''){
      this.selected.push({
        questionNum: this.tAgent.questionNum,
        questionDesc: this.tAgent.questionDesc,
        value: "",
        description: travelAgent
      })
    }

    /**
     * Pass the details to be saved
     */
    this.travelForm.value.questionList = this.selected.sort((a, b) => {return a.questionNum - b.questionNum});
    this.travelForm.value.fullName = this.travelForm.value.firstName + " " + this.travelForm.value.lastName

    if(this.travelForm.valid){
      this.api.postTravelInformation(this.travelForm.value)
      .subscribe({
        next:(res)=>{
          console.log(this.travelForm.value);
          this.travelForm.reset();
          this._snackBar.open("Successfully Saved!", '', {
            duration: 1500,
          });
          this.dialogRef.close('save');
        },
        error: ()=>{
          this._snackBar.open("Error while saving", 'Close', {
            duration: 1500,
          });
        }
      })
    }
    console.log(this.travelForm.value)
  }

}
