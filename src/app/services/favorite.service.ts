import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService{
  [x: string]: any;

  public favourite:any=[]




  private url='http://localhost:9191/Favorite/'
  constructor(private http: HttpClient) {
   
   
   }

  addFavorit(payload:any)  :Observable<any>{

  
    return this.http.post<Favorite>(this.url+"addFavorite", payload ,{headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }


  Unfavorit(idNFT:any)
  {
    return this.http.delete<Favorite>(`${this.url+"delete"}/${idNFT}`);
  
  }
  deleteAfterSold(id:any )
  {
    return this.http.delete<Favorite>(`${this.url+"deleteBuyFav"}/${id}`);
  }
  
  getFavorit(id:any){
    
    return this.http.get<Favorite>(`${this.url+"findAllFavorite"}/${id}`)
  
  }

  MustFav()  {
    return this.http.get(this.url+"favoriteMust");
  }

  


}
