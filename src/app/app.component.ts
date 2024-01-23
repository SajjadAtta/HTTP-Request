import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from './model/products';
import { productServices } from './services/products.services';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{
  title = 'AngularHttpRequest';
  allProducts: Product[] = [];
  isFetching:boolean = false;
  isEditMode:boolean = false;
  currentEleVal:string;
  errorMesg:string = null;
  errorsub:Subscription;
  @ViewChild('products') form: NgForm;
  constructor(private http: HttpClient, private productService:productServices){
  }

  ngOnInit(){
    this.fetchProducts();
    this.errorsub = this.productService.error.subscribe((mesg) =>{
      this.errorMesg = mesg;
    })
  }
  onProductFetch(){
    this.fetchProducts();
    
  }

  createProduct(products:{pName:string, desc:string, price:string}){
    if(!this.isEditMode) {
      this.productService.createProduct(products);
    }else{
      this.productService.updateProduct(this.currentEleVal,products);
    }
  }
  private fetchProducts(){
    this.isFetching = true
    this.productService.fetchProduct()
    .subscribe((product) => {
      this.allProducts = product;
      this.isFetching = false;
    }, (err) =>{
      this.errorMesg = err.message;
    })
  }
  delProduct(id:string){
    this.productService.dellProduct(id);
  }
  delAllProduct(){
    this.productService.dellAllProduct();
  }
  editProduct(id:string){
    this.currentEleVal = id;
    let currentEle =  this.allProducts.find((p) => {
      return p.id === id;
    })
    
    this.form.setValue({
      desc:currentEle.desc,
      pName:currentEle.pName,
      price:currentEle.price
    })
    this.isEditMode = true;
  }

  ngOnDestroy(): void {
    this.errorsub.unsubscribe();
  }
  
}


