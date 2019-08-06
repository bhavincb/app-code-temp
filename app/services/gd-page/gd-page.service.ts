import { RequestService } from './../request/request.service';
import { layout } from 'tns-core-modules/utils/utils';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
  getString,
  setString,
} from "tns-core-modules/application-settings";
@Injectable()
export class GdPageService {

  constructor(private url: UrlService, private req: RequestService) { }

  loadPage(page): Promise<any> {

    return new Promise((resolve, reject) => {
      let url = this.url.pages + page.id + "/";
      console.log("load single page url", url);
      this.req.request(url, {}, 0).then((data) => {
        if (data.body) {
          page = data.body;
        }
        resolve({ gdPage: page });
      }).catch((error) => {
        console.log("load single page", error);
        reject(error);
      });
    });
  }
}
