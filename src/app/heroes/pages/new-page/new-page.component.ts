import { Component } from '@angular/core';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
    `
    mat-card {
      background-color: #D0ECE7;
    }
    `
  ]
})
export class NewPageComponent {

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ];

}


