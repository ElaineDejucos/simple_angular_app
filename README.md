# MyAngularApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



Install the following to start an Angular Project
1. Make sure that Node and Angular were install.
    To check, open cmd type the following
        a. For Node: > node --version
        b. For Angular: > ng version OR ng -version

    If the version is not available install first the node and angular.
    To install, type > npm install -g @angular/cli

2. Install JSON-server
   a. npm install -g json-server

3. Install chart (using syncfusion)
   a. npm install @syncfusion/ej2/angular-charts -save
   b. ng generate component chart


HOW TO RUN THE APPLICATION
1. Open the location where you saved the application
2. Open a CMD or Git Bash by doing either of the following:
   a. To open in CMD, on the address bar, kindly type cmd then press enter. (You will notice that the path in the cmd is the path of the project)
   b. To open in Git Bash, right click inside the folder, select "Git Bash Here"

3. Once open, type the following:
   a. json-server --watch db.json (When using a git bash)
   b. ng serve --open (When using a git bash)


   NOTE: Kindly close any banner that will show at the top of the screen. "This application was built using a trial version of Syncfusion Essential Studio. Please include a valid license to permanently remove this license validation message. You can also obtain a free 30 day evaluation license to temporarily remove this message during the evaluation period. Please refer to this help topic for more information." As I used a syncfusion to be able to add a chart. 