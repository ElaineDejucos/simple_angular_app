import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import countryList from './json/countries.json';
import questionaires from './json/questionaires.json';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

export interface Country {
  letter: string,
  names: string[]
}

export interface Questions {
  QuestionNo: string,
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
  questionNum: string,
  value: string
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

  constructor(
    private _formBuilder: FormBuilder, 
    private api: ApiService, 
    private dialogRef: MatDialogRef<AddInformationComponent>
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

  onEnter(value: string){
    if (value){
      this.transportation.push(value)
    }
  }

  /**
   * Questions answers
   * @param selectedVal 
   * @param questionNum 
   */
  selectedOpt(selectedVal: string, questionNum: string): void{
    var forUpdate = this.selected.filter(item => {
      return item.questionNum == questionNum
    }).length > 0 ? true : false;
    if (forUpdate){
      for (var x in this.selected){
        if (this.selected[x].questionNum == questionNum) {
          this.selected[x].value = selectedVal;
          break;
        }
      }
    }
    else {
      this.selected.push({
        questionNum: questionNum,
        value: selectedVal
      });
    }
  }

  showChild(itemQuestionNum: string): boolean{
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
    if (this.transportation && this.transportation.length > 0) {
      let transpo = this.transportation[this.transportation.length-1].split("\n")
      this.transportation = []
      transpo.forEach(item => {
        if (item != ''){
          
          this.transportation.push(item);
        }
      })
      this.travelForm.value.transportation = this.transportation;
    }
    this.travelForm.value.questionList = this.selected;
    this.travelForm.value.fullName = this.travelForm.value.firstName + " " + this.travelForm.value.lastName
    this.travelForm.value.country = this.countryForm.value

    if(this.travelForm.valid){
      this.api.postTravelInformation(this.travelForm.value)
      .subscribe({
        next:(res)=>{
          console.log(this.travelForm.value);
          this.travelForm.reset();
          this.dialogRef.close('save');
          alert("Saved Successfully!");
        },
        error: ()=>{
          alert("Error while saving");
        }
      })
    }
    console.log(this.travelForm.value)
  }

}
