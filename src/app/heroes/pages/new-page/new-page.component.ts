import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero, Publisher } from '../../interfaces/hero.interface';

import { HeroesService } from '../../services/heroes.service';

import { filter, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';


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
export class NewPageComponent implements OnInit {

  //Formulario reativo
  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable:true }),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  })

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ){}

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById(id) ),
      ).subscribe( hero => {
        //si no existe el heroe te redirecciona fuera
        if( !hero ) return this.router.navigateByUrl('/');
        // pero si existe:
        this.heroForm.reset(hero)
        return;
      })
  }

  onSubmit():void{
    if (this.heroForm.invalid) return;

    if(this.currentHero.id ){

      this.heroesService.updateHero(this.currentHero)
        .subscribe( hero => {
            this.showSnackBar(`${hero.superhero} updated!`)
      });
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackBar(`${hero.superhero} updated!`)
        this.router.navigate( ['/heroes/edit', hero.id] )
    })
  }

  onDeleteHero(){
    if (!this.currentHero.id) throw Error('Hero id is required');

      const dialogRef = this.dialog.open(ConfirmDialogComponent,{
        data: this.heroForm.value
      })

      // dialogRef.afterClosed().subscribe( result => {
      //   if (!result) return
      //   this.heroesService.deleteHeroById(this.currentHero.id)
      //     .subscribe( wasDeleted => {
      //       if (wasDeleted)
      //         this.router.navigate (['/heroes'])
      //     })

      // })

      //otra manera de hacerlo sin un suscribe dentro de otro:
      dialogRef.afterClosed()
        .pipe(
          filter( (result: boolean) => result ),
          switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
          filter((wasDeleted:boolean) => wasDeleted)
        )
        .subscribe( result => {
          this.router.navigate (['/heroes'])
        })


  }

  showSnackBar(message:string):void{
    this.snackBar.open(message, 'done', {
      duration: 1500,
    })
  }


}


