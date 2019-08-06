import { RouterExtensions } from 'nativescript-angular/router';
import { BlogService } from './../../services/blog/blog.service';

import { GdPageService } from './../../services/gd-page/gd-page.service';
import { SharedDataService } from './../../services/shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { TextField } from "tns-core-modules/ui/text-field";
import { TextView } from "tns-core-modules/ui/text-view";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { Page } from "tns-core-modules/ui/page";
import * as SocialShare from "nativescript-social-share";
import {
    AndroidApplication,
    AndroidActivityBackPressedEventData
} from "tns-core-modules/application";
import * as application from "tns-core-modules/application";
// import * as Keyboard from "nativescript-keyboardshowing";
/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "gd-page", loadChildren: "./gd-page/gd-page.module#BlogInfoModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "GdPage",
    moduleId: module.id,
    templateUrl: "./gd-page.component.html",
    styleUrls: ["./gd-page.component.css"]
})
export class GdPageComponent implements OnInit {
    gdPage: any;
    title: string;
    isLoading: boolean;
    // pageHtml = "";
    constructor(
        private route: ActivatedRoute,
        private data: SharedDataService,
        private gdPageUtil: GdPageService,
        private cd: ChangeDetectorRef,
        private router: RouterExtensions,
        private page: Page,
        private zone: NgZone,
    ) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        this.gdPage = this.data.gdPageInfo.page;
        this.title = this.data.gdPageInfo.title;
        if (this.gdPage.status == undefined) {
            this.gdPageUtil.loadPage(this.gdPage).then((data) => {
                this.gdPage = data.gdPage;
                // this.pageHtml = '<head><style>::-webkit-scrollbar{width:2px;}body{ margin: 0; padding: 0 }img{ max-width: 100%; }body > iframe{ width: 100 %; background-color: green; position: absolute; height: 100 %; border: none } < /style><body><iframe src=' + this.gdPage.link + '></iframe > </body>'
                // console.log(this.pageHtml);
            });
    }
}
goBack() {
    this.router.backToPreviousPage();
}

}
