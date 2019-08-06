import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { RequestService } from './services/request/request.service';
import { UrlService } from './services/url/url.service';
import { GdPageService } from './services/gd-page/gd-page.service';
import { BlogService } from './services/blog/blog.service';
import { MenusService } from './services/menus/menus.service';
import { CategoryService } from './services/category/category.service';
import { SharedDataService } from './services/shared-data/shared-data.service';
import { UserService } from './services/user/user.service';
import { SettingService } from './services/setting/setting.service';
import { PlaceService } from './services/place/place.service';
import { AuthUserService } from './services/auth-user/auth-user.service';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from '@angular/common/http';


// import { TNSFrescoModule } from "nativescript-fresco/angular";
// import * as frescoModule from "nativescript-fresco";
import * as imageModule from "nativescript-image";
import { TNSImageModule } from 'nativescript-image/angular';
import * as applicationModule from "tns-core-modules/application";

if (applicationModule.android) {
    applicationModule.on("launch", () => {
        // frescoModule.initialize();
        imageModule.initialize();
    });
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        TNSImageModule,
        // TNSFrescoModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        BlogService,
        GdPageService,
        UrlService,
        RequestService,
        CategoryService,
        SharedDataService,
        UserService,
        SettingService,
        MenusService,
        PlaceService,
        AuthUserService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
