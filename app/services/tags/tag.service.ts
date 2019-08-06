import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
  getString,
  setString,
} from "tns-core-modules/application-settings";
@Injectable()
export class TagService {
  tags = [];
  index = {};
  private totalPages = 0;
  constructor(
    private url: UrlService,
    private req: RequestService) { }
  // // use when implement data caching
  saveLocalTags(){
    setString("tags",JSON.stringify(this.tags)) 
  }

  loadLocalTags() {
    let blogs = getString("tags");
    if (blogs && blogs != null) {
      this.tags = JSON.parse(blogs);
      return this.tags;
    } else {
      return [];
    }
  }
  loadTags(page=1): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.url.tags;
      this.req.request(url, {}, 0).then((data) => {
        this.totalPages = data.headers.get("X-WP-TotalPages");
        if (page == 1) {
          this.tags = [{ id: '', name: 'All', count: '' }];
          this.tags = this.tags.concat(data.body);
          for (let i = 2; i <= this.totalPages; i++){
            this.loadTags(i);
          }
        } else {
          // this.index[page.toString()] = ;
          this.tags = this.tags.concat(data.body);
        }
        if (page == this.totalPages) {
          // for (let i = 2; i <= this.totalPages; i++){
          //   this.tags = this.tags.concat(this.index[i.toString()]);
          // }
          this.saveLocalTags();
          
        }
        resolve(this.tags);
      }).catch((error) => {
        console.log("loadTags", error);
      });
    });
  }
  getCategory(tagId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.url.tags+tagId;
      this.req.request(url, {}, 0).then((data) => {
        let flag = false;
        for (let i = 0; i < this.tags.length;i++){
          if (this.tags[i].id == data.body.id) {
            flag=true;
            break;
          }
        }
        if(flag){
          resolve(data.body);  
        } else {
          this.tags = this.tags.concat(data.body);
          this.saveLocalTags();
          resolve(data.body);  
        }
        
      }).catch((error) => {
        console.log("getCategory", error);
      });
    });
  }
}
