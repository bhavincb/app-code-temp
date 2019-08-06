// import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
  getString,
  setString,
  remove
} from "tns-core-modules/application-settings";
@Injectable()
export class UserService {
  public user = {
    isLoaded: false,
    id: "",
    fname: "",
    lname: "",
    mobile: "",
    email: "",
  }
  public isLoggedIn = false;
  public isLoginRequired = false;
  public token: any;

  constructor(private url: UrlService) { }

  checkLogin(): Boolean {
    let user: any = getString("geoUser");
    console.log("check Login user value", user);
    if (user) {
      user = JSON.parse(user);
      this.saveUser(user);
      return true;
    } else {
      return false;
    }
  }
  saveUser(user) {
    setString("geoUser", JSON.stringify(user))

    console.log("set local user value:", user);

    this.user.isLoaded = true;
    this.user.id = user.id;
    this.user.fname = user.fname;
    this.user.lname = user.lname;
    this.user.mobile = user.mobile;
    this.user.email = user.email;
    this.token = user.token;
    this.isLoggedIn = true;
  }
  logout() {
    this.isLoggedIn = false;
    this.token = null;
    remove('geoUser');
  }
}
