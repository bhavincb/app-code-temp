import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { BlogInfoComponent } from "./blog-info.component";

const routes: Routes = [
	{ path: "", component: BlogInfoComponent }
];

@NgModule({
	imports: [NativeScriptRouterModule.forChild(routes)],
	exports: [NativeScriptRouterModule]
})
export class BlogInfoRoutingModule { }
