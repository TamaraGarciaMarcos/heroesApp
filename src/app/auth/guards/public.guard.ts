import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap, map } from 'rxjs';



@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch , CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  private checkAuthStatus(): boolean | Observable<boolean> {

    return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => console.log('Authenticated:', isAuthenticated)),
        tap( isAuthenticated =>{
          if (isAuthenticated ){
            this.router.navigate(['./'])
          }
        }),
        map( isAuthenticated => !isAuthenticated ),
      )

  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    // console.log('Can Match')
    // console.log({route, segments})
    return this.checkAuthStatus()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // console.log('can Activate')
    // console.log({route, state})

    return this.checkAuthStatus()
  }

}
