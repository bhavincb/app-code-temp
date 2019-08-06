import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full", canActivate: [AuthGuard] },
    { path: "login", loadChildren: "./login/login.module#LoginModule" },
    { path: "home", loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuard] },
    { path: "blog-info", loadChildren: "./blob-info/blog-info.module#BlogInfoModule" },
    { path: "gd-page", loadChildren: "./pages/gd-page/gd-page.module#GdPageModule" },
    { path: "settings", loadChildren: "./settings/settings.module#SettingsModule" },
    { path: "places-list", loadChildren: "./places-list/places-list.module#PlacesListModule" },
    { path: "place-info", loadChildren: "./place-info/place-info.module#PlaceInfoModule" },
    { path: "author-info", loadChildren: "./author-info/author-info.module#AuthorInfoModule" }

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    providers: [
        AuthGuard,
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
