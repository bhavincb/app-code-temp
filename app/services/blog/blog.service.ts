import { RequestService } from './../request/request.service';
import { layout } from 'tns-core-modules/utils/utils';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
  getString,
  setString,
} from "tns-core-modules/application-settings";
@Injectable()
export class BlogService {
  blogs = [];
  authors = {};
  selectedAuthorId = 0;
  featuredImages = {};
  constructor(private url: UrlService, private req: RequestService) { }
  // // use when implement data caching
  // saveLocalBlogs(blogs){
  //   setString("blogs",JSON.stringify(blogs)) 
  // }

  // loadLocalBlogs(){
  //   let blogs=getString("blogs");
  //   if(blogs&&blogs!=null){
  //     this.blogs=JSON.parse(blogs);
  //   }
  // }

  loadPosts(catID, pageNo, searchText, authorId = null): Promise<any> {
    let categories = '';
    let search = '';
    let author = '';
    if (catID) {
      categories = "&categories=" + catID;
    }
    if (searchText != '' && searchText) {
      search = "&search=" + searchText;
    }
    if (authorId) {
      author = "&author=" + authorId;
    }
    return new Promise((resolve, reject) => {
      let url = this.url.posts + "?page=" + pageNo + categories + search + author;
      console.log("load post url", url);
      this.req.request(url, {}, 0).then((data) => {
        let posts = data.body;
        if (posts.length) {
          posts.forEach((post) => {
            post.author_img = '~/shared/imgs/user-48.png';
            post.featured_img = '~/shared/imgs/default-thumbnail.jpg';
            post.displayDate = this.formatTime(post.date);
            this.getAuthorInfo(post);
            this.getFeaturedImage(post);
            // this.getComments(post);
          })
        } else {
          posts = [];
        }
        resolve({ totalPages: data.headers.get("X-WP-TotalPages"), blogs: posts });
      }).catch((error) => {
        console.log("load posts", error);
        reject(error);
      });
    });
  }
  loadPost(post): Promise<any> {

    return new Promise((resolve, reject) => {
      let url = this.url.posts + post.id + "/";
      console.log("load single post url", url);
      this.req.request(url, {}, 0).then((data) => {
        if (data.body) {
          post = data.body;
          post.author_img = '~/shared/imgs/user-48.png';
          post.featured_img = '~/shared/imgs/default-thumbnail.jpg';
          post.displayDate = this.formatTime(post.date);
          this.getAuthorInfo(post);
          this.getFeaturedImage(post);
          // this.getComments(post);
        }
        resolve({ blog: post });
      }).catch((error) => {
        console.log("load single post", error);
        reject(error);
      });
    });
  }
  getAuthorInfo(post) {
    let authorId = post.author;
    if (this.authors[authorId]) {
      this.authors[authorId].image = this.authors[authorId].avatar_urls['96'].split('?')[0];
      post.author_img = this.authors[authorId].avatar_urls['96'].split('?')[0] + "?s=" + layout.toDevicePixels(72);
      this.authors[authorId].thumbnail = post.author_img;
      post.author = this.authors[authorId];
      return post.author_img;
    }
    let url = this.url.users + authorId
    this.req.request(url, {}, 0).then((data) => {
      this.authors[authorId] = data.body;
      post.author_img = this.authors[authorId].avatar_urls['96'].split('?')[0] + "?s=" + layout.toDevicePixels(72);
      this.authors[authorId].thumbnail = post.author_img;
      post.author = this.authors[authorId];
      return post.author_img;
    }).catch((error) => {
      console.log("getAuthorInfo", error);
    });
  }
  getFeaturedImage(post) {
    let imageId = post.featured_media;

    if (imageId == '0') {
      return '~/shared/imgs/default-thumbnail.jpg';
    }
    if (this.featuredImages[imageId]) {
      if (this.featuredImages[imageId].media_details.sizes == undefined) {
        console.log("medium size not available:", imageId);
      }
      post.featured_img = this.featuredImages[imageId].media_details && this.featuredImages[imageId].media_details.sizes ? this.featuredImages[imageId].media_details.sizes.medium_large.source_url : '~/shared/imgs/default-thumbnail.jpg';
      // post.featured_img = this.featuredImages[imageId].media_details && this.featuredImages[imageId].media_details.sizes ? this.featuredImages[imageId].media_details.sizes.medium.source_url:this.featuredImages[imageId].source_url;
      post.featuredThumbnail = this.featuredImages[imageId].media_details && this.featuredImages[imageId].media_details.sizes ? this.featuredImages[imageId].media_details.sizes.medium.source_url : '~/shared/imgs/default-thumbnail.jpg';
      return post.featured_img;
    }
    let url = this.url.media + imageId
    this.req.request(url, {}, 0).then((data) => {
      if (data.body.code == undefined) {
        this.featuredImages[imageId] = data.body;
        if (this.featuredImages[imageId].media_details.sizes == undefined) {
          console.log("medium size not available:", imageId);
        }
        post.featured_img = this.featuredImages[imageId].media_details && this.featuredImages[imageId].media_details.sizes ? this.featuredImages[imageId].media_details.sizes.medium_large.source_url : '~/shared/imgs/default-thumbnail.jpg';
        // post.featured_img = this.featuredImages[imageId].media_details && this.featuredImages[imageId].media_details.sizes ? this.featuredImages[imageId].media_details.sizes.medium.source_url:this.featuredImages[imageId].source_url;
        post.featuredThumbnail = this.featuredImages[imageId].media_details && this.featuredImages[imageId].media_details.sizes ? this.featuredImages[imageId].media_details.sizes.thumbnail.source_url : '~/shared/imgs/default-thumbnail.jpg';
      }
      return post.featured_img;
    }).catch((error) => {
      console.log("getFeaturedImage", error);
    });
  }
  formatComments(comments) {
    let threaded = [];
    let removeComments = [];
    let comment;
    let child;
    // let parent: any;
    for (let i = 0; i < comments.length;) {
      comment = comments[i];
      comment.displayDate = this.formatTime(comment.date);
      comment.author_img = comment.author_avatar_urls['48'].split('?')[0] + "?s=" + layout.toDevicePixels(72);
      if (comment.parent == 0) {
        comment.depth = 0;
        comment.childCount = 0;
        threaded.push(comment);
        comments.splice(i, 1);
        // console.log("CommentsLength:", comments.length);
      } else {
        i += 1;
      }
    };
    let depth = 0;
    let flag = false;
    while (comments.length > 0) {
      depth += 1;
      for (let i = 0; i < comments.length;) {
        child = comments[i];
        threaded.forEach((parent, j) => {
          if (parent.id == child.parent) {
            parent.childCount += 1;
            child.depth = depth + parent.depth;
            threaded.splice(j + parent.childCount, 0, child);
            comments.splice(i, 1);
            flag = true;
          }
        });
        if (!flag) {
          i += 1;
        }
      };
    }
    return threaded;
  }
  getComments(post): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.url.comments + "?post=" + post.id;
      this.req.request(url, {}, 0).then((data) => {
        if (data.body.length != undefined) {
          if (data.body.length) {
            post.isCommentsLoaded = true;
            post.comments = this.formatComments(data.body);
            // post.comments = post.comments.reverse();
            // post.comments.forEach((comment) => {
            //   comment.displayDate = this.formatTime(comment.date);
            // });
            resolve(post.comments);
          } else {
            post.isCommentsLoaded = true;
            post.comments = [];
            resolve([]);
          }

        } else {
          resolve([]);
        }
      }).catch((error) => {
        console.log("getComments", error);
      });
    });
  }
  createComment(blog, commentText, parentId = 0) {
    let url = this.url.comments;
    let data: any = {};
    data.post = blog.id;
    data.content = commentText;
    if (parentId != 0) {
      data.parent = parentId;
    }
    return this.req.request(url, data, 1).then((success) => {
      console.log("create comment success", success);
      let comment = success.body;
      comment.displayDate = this.formatTime(comment.date);
      return Promise.resolve(comment);
    }).catch((error) => {

      console.log("create comment error", error);
      return Promise.reject(error);
    });
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
