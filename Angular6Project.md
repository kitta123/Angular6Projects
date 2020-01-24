Instasll Node.js     :node -v
Install npm          :npm -v

Install Angular-CLI :-

npm install -g @angular/cli
npm install -g @angular/cli@latest

Use VS code for editor.

ng new Angular6Project -d (for dryrun)

ng new Angular6Project --skip-tests (without specs(testing files) files)

Installing Bootstrap :-

npm install bootstrap jquery --save

Add bootstrap in angular.json file and in 
"styles":[ "src/styles.scss","./node_modules/bootstrap/dist/css/bootstrap.min.css"]

"scripts": ["./node_modules/jquery/dist/jquery.min.js",
"./node_modules/bootstrap/dist/js/bootstrap.min.js"]


Routing in Angular :-

import routing modules in app.module.ts

ng g m app-routimg --flat=true --module=app  (To Generate routimg module in app.module.ts)

{ path:'',component: componentNAme }  (Add in app-routing.module.ts)
Use <a routerLinkActive="active" routerLink="path"></a>

Add <router-outlet></router-outlet> in app.component.html at the End.

Reactive Forms in Angular :-
 Model Driven Forms.
 
import { FormGroup, FormControl } from @angular/forms;