import { Injectable } from '@angular/core';

@Injectable()
export class SharedDataService {
  
  private _blogInfo:{post:any,id:any,title:any}={
    post:{},
    id:1,
    title:"",
  }
  get blogInfo(){
    return this._blogInfo;
  }
  set blogInfo(data){
    if(data.post!=undefined&&data.post!=null){
      this._blogInfo.post=data.post;
    }else{
      this._blogInfo.post=null;
    }
    if(data.id!=undefined&&data.id!=null){
      this._blogInfo.id=data.id;
    }else{
      this._blogInfo.id=0;
    }
    if(data.title!=undefined&&data.title!=null){
      this._blogInfo.title=data.title;
    }else{
      this._blogInfo.title="";
    }
  }

  private _placeInfo:{place:any,id:any,title:any}={
    place:{},
    id:1,
    title:"",
  }
  get placeInfo(){
    return this._placeInfo;
  }
  set placeInfo(data){
    if(data.place!=undefined&&data.place!=null){
      this._placeInfo.place=data.place;
    }else{
      this._placeInfo.place=null;
    }
    if(data.id!=undefined&&data.id!=null){
      this._placeInfo.id=data.id;
    }else{
      this._placeInfo.id=0;
    }
    if(data.title!=undefined&&data.title!=null){
      this._placeInfo.title=data.title;
    }else{
      this._placeInfo.title="";
    }
  }

  private _gdPageInfo: { page: any, id: any, title: any } = {
    page: {},
    id: 1,
    title: "",
  }
  get gdPageInfo() {
    return this._gdPageInfo;
  }
  set gdPageInfo(data) {
    if (data.page != undefined && data.page != null) {
      this._gdPageInfo.page = data.page;
    } else {
      this._gdPageInfo.page = null;
    }
    if (data.id != undefined && data.id != null) {
      this._gdPageInfo.id = data.id;
    } else {
      this._gdPageInfo.id = 0;
    }
    if (data.title != undefined && data.title != null) {
      this._gdPageInfo.title = data.title;
    } else {
      this._gdPageInfo.title = "";
    }
  }
  constructor() { }

}
