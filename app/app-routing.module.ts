import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full", canActivate: [AuthGuard] },
    { path: "login", loadChildren: () =>import("./login/login.module").then(mod=>mod.LoginModule) },
    { path: "home", loadChildren: () =>import("./home/home.module").then(mod=>mod.HomeModule), canActivate: [AuthGuard] },
    { path: "blog-info", loadChildren: () =>import("./blob-info/blog-info.module").then(mod=>mod.BlogInfoModule) },
    { path: "gd-page", loadChildren: () =>import("./pages/gd-page/gd-page.module").then(mod=>mod.GdPageModule) },
    { path: "settings", loadChildren: () =>import("./settings/settings.module").then(mod=>mod.SettingsModule) },
    { path: "places-list", loadChildren:()=> import("./places-list/places-list.module").then(mod=>mod.PlacesListModule) },
    { path: "place-info", loadChildren: ()=>import("./place-info/place-info.module").then(mod=>mod.PlaceInfoModule) },
    { path: "author-info", loadChildren: ()=>import("./author-info/author-info.module").then(mod=>mod.AuthorInfoModule) }

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    providers: [
        AuthGuard,
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
