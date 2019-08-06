

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

// import { NgShadowModule } from '../nativescript-ng-shadow';
// import { TNSFrescoModule } from "nativescript-fresco/angular";
import { PlacesListRoutingModule } from "./places-list-routing.module";
import { PlacesListComponent } from "./places-list.component";

@NgModule({
    imports: [
        // NgShadowModule,
        // TNSFrescoModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptCommonModule,
        PlacesListRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        PlacesListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PlacesListModule { }
