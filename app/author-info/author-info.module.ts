import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

// import { TNSFrescoModule } from "nativescript-fresco/angular";
import { AuthorInfoRoutingModule } from "./author-info-routing.module";
import { AuthorInfoComponent } from "./author-info.component";

@NgModule({
    imports: [
        // TNSFrescoModule,
        NativeScriptUIListViewModule,
        NativeScriptCommonModule,
        AuthorInfoRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AuthorInfoComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AuthorInfoModule { }
