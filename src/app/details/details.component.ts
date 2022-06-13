import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Details {
  questionNum: string,
  questionDesc: string,
  value: string,
  description: string
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

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.data
  }


}
