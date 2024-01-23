import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, map, throwError } from 'rxjs';
import { Product } from "../model/products";
import { Content } from "@angular/compiler/src/render3/r3_ast";
  
  @Injectable({
  providedIn:"root"
})
export class productServices{
  error = new Subject <string>();
  constructor(private http: HttpClient){
  }
  createProduct(products: {pName:string, desc:string, price:string}){
    console.log(products);
    const header = new HttpHeaders({'myHeader':'ProLearning'})
    this.http.post('https://procadmytest-default-rtdb.firebaseio.com/products.json', products, {headers:header})
    .subscribe((res) =>{
     console.log(res);
    },(err) =>{
      this.error.next(err.message);
    })
  }
  
  fetchProduct(){
    const header = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')

    const param = new HttpParams()
    .set('print', 'pretty')
    .set('page',1)
    return this.http.get< {[key:string]:Product}>('https://procadmytest-default-rtdb.firebaseio.com/products.json',
           {headers:header, params:param})
    .pipe(map((res) => {
      const products = [];
      for(const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id:key})
        }
      }
      return products;
    }), catchError((res) =>{
       return throwError(res);
    }))
  }
  dellProduct(id:string){
    let header = new HttpHeaders();
    header =  header.append('myheader1', '1')
    header = header.append('myHeader2', '2')
    this.http.delete('https://procadmytest-default-rtdb.firebaseio.com/products/' +id+ '.json', {headers:header})
    .subscribe();
  }
  dellAllProduct(){
    this.http.delete('https://procadmytest-default-rtdb.firebaseio.com/products.json')
    .subscribe();
  }
  updateProduct(id: string, product: Product){
    this.http.put('https://procadmytest-default-rtdb.firebaseio.com/products/' +id+ '.json', product)
    .subscribe();
  }
}