import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

// import { TNSFrescoModule } from "nativescript-fresco/angular";
import { PlaceInfoRoutingModule } from "./place-info-routing.module";
import { PlaceInfoComponent } from "./place-info.component";

@NgModule({
    imports: [
        // TNSFrescoModule,
        NativeScriptUIListViewModule,
        NativeScriptCommonModule,
        PlaceInfoRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        PlaceInfoComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PlaceInfoModule { }
