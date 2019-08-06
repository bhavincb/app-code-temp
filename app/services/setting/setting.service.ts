import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
  remove,
  getString,
  setString,
} from "tns-core-modules/application-settings";
import * as app from "tns-core-modules/application";

@Injectable()
export class SettingService {
  settings = {
    view: 'Card View',
    actionBarBackgroundColor: 'blue',
    actionBarTextColor: 'white',
    leftDrawerLogo: '',
    leftDrawerTitle: '',
    leftDrawerTagline: '',
    leftDrawerBackgroundColor: '#a5818f',
    leftDrawerTextColor: '#ffffff',
    isLoginRequired: false,
    rootCss: '\
      ActionBar {\
        background-color: blue;\
        color: white;\
      }\
      ActionBar .actionbar-search.action-bar-title{\
          background-color: #3C5AFD;\
          color: white;\
      }\
      .drawer-content {\
        background-color: #053140;\
      }\
      .drawer-content Label {\
        color: white;\
      }\
      .drawer-content Label.navItem{\
        background-color: white;\
        color: darkgray;\
      }\
      .homeContent .blogsList {\
        background-color: #ffffff;\
      }\
      .homeContent .blogContainer{\
          background-color: #f4f4f4f4;\
      }\
      .homeContent.aurthor_title{\
      }\
      .homeContent .blogTitle,.homeContent .blogCatNames{\
          color:white;\
          background-color: rgba(0, 0, 0, 0.3);\
      }\
      .homeContent .list .blogTitle,.homeContent .list .blogCatNames{\
          background-color: transparent;\
      }\
      .homeContent .list .blogTitle{\
          color:rgba(0,0,0,0.7);\
      }\
      .homeContent .list .blogCatNames{\
          color: rgba(0,0,0,0.5);\
      }\
      .blogInfoContent .childComment {\
          padding-left: 20;\
          background-color: #f4f4f4;\
      }\
      .blogInfoContent .parentComment{\
          padding-left:0;\
          background-color: #cccccc;\
      }\
      .blogInfoContent .childComment,.blogInfoContent .parentComment{\
          border-bottom-width: 1;\
          border-bottom-color: rgba(0,0,0,0.1);\
      }',
  }

  constructor(private req: RequestService,
    private url: UrlService) {
    this.fetchSettings();
    // remove('settings');
  }
  fetchSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadLocalSettings();
      app.addCss(this.settings.rootCss);
      this.req.request(this.url.settings, {}, 0).then((data) => {
        if (JSON.stringify(data.body) != JSON.stringify(this.settings)) {
          this.settings.isLoginRequired = data.body.appwp_login_required == 1;
          this.settings.view = data.body.archive_view_style == "list" ? "List View" : "Card View";
          this.settings.actionBarBackgroundColor = data.body.menu_bar_color_style;
          this.settings.actionBarTextColor = data.body.menu_bar_text_color_style;
          this.settings.leftDrawerLogo = data.body.left_drawer_logo_url ? data.body.left_drawer_logo_url : null;
          this.settings.leftDrawerTitle = data.body.left_drawer_title_text ? data.body.left_drawer_title_text : null;
          this.settings.leftDrawerTagline = data.body.left_drawer_tagline_text ? data.body.left_drawer_tagline_text : null;
          this.settings.leftDrawerBackgroundColor = data.body.left_drawer_background_color ? data.body.left_drawer_background_color : '#a5818f';
          this.settings.leftDrawerTextColor = data.body.left_drawer_text_color ? data.body.left_drawer_text_color : '#ffffff';
          this.settings.rootCss = this.generateAppCss();
          // console.log("settings:", this.settings)
          this.saveLocalSettings();
          app.addCss(this.settings.rootCss);
          resolve({ refresh: true, settings: this.settings });
        } else {
          resolve({ refresh: false, settings: this.settings })
        }

      })
    })

  }
  // // use when implement data caching
  saveLocalSettings() {
    setString("settings", JSON.stringify(this.settings))
  }
  setView(no) {
    if (no == 0) {
      this.settings.view = "Card View";
    } else {
      this.settings.view = "List View";
    }
    this.saveLocalSettings();
  }
  loadLocalSettings() {
    let settings: any = getString("settings");
    if (settings && settings != null) {
      settings = JSON.parse(settings);
      if (!settings.rootCss) {
        this.settings.view = settings.view;
        this.saveLocalSettings();
        return this.settings;
      } else {
        this.settings = settings;
        return this.settings;
      }
      return this.settings;
    } else {
      return this.settings;
    }
  }
  generateAppCss() {
    let css = '\
      ActionBar {\
        background-color:'+ this.settings.actionBarBackgroundColor + ';\
        color: '+ this.settings.actionBarTextColor + ';\
      }\
      ActionBar .actionbar-search.action-bar-title{\
          background-color: '+ this.settings.actionBarBackgroundColor + ';\
          color:'+ this.settings.actionBarTextColor + ';\
      }\
      .drawer-content {\
        background-color: '+ this.settings.leftDrawerBackgroundColor + ';\
      }\
      .drawer-content Label {\
        color: '+ this.settings.leftDrawerTextColor + ';\
      }\
      .drawer-content Label.navItem{\
        background-color: white;\
        color: darkgray;\
      }\
      .homeContent .blogsList {\
        background-color: #ffffff;\
      }\
      .homeContent .blogContainer{\
          background-color: #f4f4f4f4;\
      }\
      .homeContent.aurthor_title{\
      }\
      .homeContent .blogTitle,.homeContent .blogCatNames{\
          color:white;\
          background-color: rgba(0, 0, 0, 0.3);\
      }\
      .homeContent .list .blogTitle,.homeContent .list .blogCatNames{\
          background-color: transparent;\
      }\
      .homeContent .list .blogTitle{\
          color:rgba(0,0,0,0.7);\
      }\
      .homeContent .list .blogCatNames{\
          color: rgba(0,0,0,0.5);\
      }\
      .blogInfoContent .childComment {\
          padding-left: 20;\
          background-color: #f4f4f4;\
      }\
      .blogInfoContent .parentComment{\
          padding-left:0;\
          background-color: #cccccc;\
      }\
      .blogInfoContent .childComment,.blogInfoContent .parentComment{\
          border-bottom-width: 1;\
          border-bottom-color: rgba(0,0,0,0.1);\
      }';
    return css;
  }
}
