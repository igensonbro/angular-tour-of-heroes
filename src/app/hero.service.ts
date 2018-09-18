import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { catchError, map, tap} from 'rxjs/operators';

import { Hero } from './hero'
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  private herosUrl = 'api/heroes';

  constructor(private httpClient: HttpClient, private messageService : MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }


  /**
   * Handle Http operation that failed
   * @param operation name of the operation that failed
   * @param result Optional value to return as observable result
   */
  private handleError<T>(operation = 'operation', result? : T) {
    return (error: any) : Observable<T> => {

      //TODO: send the error to remove logging infra
      console.error(error);

      //TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      //Let the app keep running by returning an empty result
      return of(result as T);
    }
  }

  getHeroes() :  Observable<Hero []> {
    return this.httpClient.get<Hero[]>(this.herosUrl)
      .pipe(
        tap(heroes => this.log('fethed heroes')),
        catchError(this.handleError('getHeroes',[]))
      );
  }

  /**
   * Get Hero by ID. Will 404 if not found
   * @param id 
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.herosUrl}/${id}`;

    return this.httpClient.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`)),
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post(this.herosUrl, hero, this.httpOptions).pipe(
      tap((hero:Hero) => this.log(`add hero w/ id=${hero.id} `)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero) : Observable<any> {
    return this.httpClient.put(this.herosUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero : Hero | number ) : Observable<Hero> {
    const id = typeof hero === 'number'? hero : hero.id;
    const url = `${this.herosUrl}/${id}`;

    return this.httpClient.delete<Hero>(url, this.httpOptions)
      .pipe(tap (_ => this.log('delete hero id=${id}')),
            catchError(this.handleError<Hero>('deleteHero')));
  }
}
