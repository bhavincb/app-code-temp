import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
import { BlogService } from './../blog/blog.service';
import { Injectable } from '@angular/core';
import {
  getString,
  setString,
} from "tns-core-modules/application-settings";
@Injectable()
export class CategoryService {
  categories = [];
  index = {};
  private totalPages = 0;
  constructor(
    private blogUtil:BlogService,
    private url: UrlService,
    private req: RequestService) { }
  // // use when implement data caching
  saveLocalCategories(){
    setString("categories",JSON.stringify(this.categories)) 
  }

  loadLocalCategories() {
    let blogs = getString("categories");
    if (blogs && blogs != null) {
      this.categories = JSON.parse(blogs);
      return this.categories;
    } else {
      return [];
    }
  }
  loadCategories(page=1): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.url.categories;
      this.req.request(url, {}, 0).then((data) => {
        this.totalPages = data.headers.get("X-WP-TotalPages");
        if (page == 1) {
          this.categories = [{ id: '', name: 'All', count: '' }];
          this.categories = this.categories.concat(data.body);
          for (let i = 2; i <= this.totalPages; i++){
            this.loadCategories(i);
          }
        } else {
          // this.index[page.toString()] = ;
          this.categories = this.categories.concat(data.body);
        }
        if (page == this.totalPages) {
          // for (let i = 2; i <= this.totalPages; i++){
          //   this.categories = this.categories.concat(this.index[i.toString()]);
          // }
          this.saveLocalCategories();
          
        }
        resolve(this.categories);
      }).catch((error) => {
        console.log("loadCategories", error);
      });
    });
  }
  getCategory(catId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.url.categories+catId;
      this.req.request(url, {}, 0).then((data) => {
        let flag = false;
        for (let i = 0; i < this.categories.length;i++){
          if (this.categories[i].id == data.body.id) {
            flag=true;
            break;
          }
        }
        if(flag){
          resolve(data.body);  
        } else {
          this.categories = this.categories.concat(data.body);
          this.saveLocalCategories();
          resolve(data.body);  
        }
        
      }).catch((error) => {
        console.log("getCategory", error);
      });
    });
  }
}
