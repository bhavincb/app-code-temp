import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
// import { placeservice } from './../blog/blog.service';
import { Injectable } from '@angular/core';
import {
  getString,
  setString,
} from "tns-core-modules/application-settings";
@Injectable()
export class PlaceService {
  
  categories = [];
  catIndex = {};
  places = [];
  authors = {};
  featuredImages = {};
  private totalPages = 0;
  constructor(
    private url: UrlService,
    private req: RequestService) { 
    this.loadLocalCategories();
  }
  // // use when implement data caching
  saveLocalCategories(){
    setString("gd_place_categories",JSON.stringify(this.categories)) 
  }

  loadLocalCategories() {
    let categories = getString("gd_place_categories");
    if (categories && categories != null) {
      this.categories = JSON.parse(categories);
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
          // this.catIndex[page.toString()] = ;
          this.categories = this.categories.concat(data.body);
        }
        if (page == this.totalPages) {
          // for (let i = 2; i <= this.totalPages; i++){
          //   this.categories = this.categories.concat(this.catIndex[i.toString()]);
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
  loadPlaces(catID, pageNo, searchText): Promise<any> {
    let categories = '';
    let search = '';

    if (catID) {
      categories = "&categories=" + catID;
    }
    if (searchText != ''&&searchText) {
      search = "&search=" + searchText;
    }

    return new Promise((resolve, reject) => {
      let url = this.url.places + "?page="+pageNo + categories + search;
      console.log("load place url", url);
      this.req.request(url, {}, 0).then((data) => {
        let places = data.body;
        if (places.length) {
          places.forEach((place) => {
          //   place.author_img = '~/shared/imgs/user-48.png';
          //   place.featured_img = '~/shared/imgs/default-thumbnail.jpg';
            place.displayDate = this.formatTime(place.date);
            // this.getAuthorInfo(place);
            this.getFeaturedImage(place);
          })
        } else {
          places = [];
        }
        resolve({ totalPages: data.headers.get("X-WP-TotalPages"),places:places});
      }).catch((error) => {
        console.log("load places", error);
        reject(error);
      });
    });
  }
  // getAuthorInfo(place) {
  //   let authorId = place.author;
  //   if (this.authors[authorId]) {
  //     place.author_img = this.authors[authorId].avatar_urls['48']
  //     place.author = this.authors[authorId];
  //     return place.author_img;
  //   }
  //   let url = this.url.users + authorId
  //   this.req.request(url, {}, 0).then((data) => {
  //     this.authors[authorId] = data.body;
  //     place.author_img = this.authors[authorId].avatar_urls['48'];
  //     place.author = this.authors[authorId];
  //     return place.author_img;
  //   }).catch((error) => {
  //     console.log("getAuthorInfo", error);
  //   });
  // }
  getFeaturedImage(place) {
    let imageId = place.featured_image.id;

    if (!place.featured_image.thumbnail) {
      return '~/shared/imgs/default-thumbnail.jpg';
    }
  }
  
  formatTime(text) {
    text = text.replace(/-/g, '/');
    text = text.replace(/T/g, '/');
    let date = new Date(text + " UTC");
    let currentTime = new Date();
    let diff = currentTime.getTime() - date.getTime();
    diff = diff / 1000;
    let minSec = 60;
    let hourSec = minSec * 60;
    let daySec = hourSec * 24;
    let yesterdaySec = daySec * 2;
    if (diff > yesterdaySec) {
      // return date.toDateString().substring(4) + ' ' + date.toTimeString().substring(0,9); 
      return date.toDateString().substring(4); 
    }
    else if (diff > daySec) {
      return "yesterday";
    }
    else if (diff > hourSec) {
      return Math.floor(diff / hourSec) + "h ago";
    }
    else if (diff > minSec) {
      return Math.floor(diff / minSec) + "m ago";
    }
    else {
      // console.log(text);
      // console.log(diff);
      return "just now";
    }
  }
}
