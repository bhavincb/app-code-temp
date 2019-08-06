import { Component } from "@angular/core";
// import * as fresco from "nativescript-fresco";
import { RouterExtensions } from 'nativescript-angular/router';
import { SettingService } from "./services/setting/setting.service";
import { UserService } from "./services/user/user.service";
//Uncomment this for firebase
// import * as firebase from "nativescript-plugin-firebase";
import { OnInit } from '@angular/core';
@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    constructor(private settingReq: SettingService, private router: RouterExtensions, private userReq: UserService) {
        // fresco.initialize();
        this.settingReq.fetchSettings().then((data) => {
            if (data.refresh) {
                this.router.navigate(['/']);
            }
            this.userReq.isLoginRequired = data.settings.isLoginRequired;
        })
    }
    ngOnInit() {
        //Uncomment this for firebase
        // firebase.init({
        //     // Optionally pass in properties for database, authentication and cloud messaging,
        //     // see their respective docs.
        // }).then(
        //     () => {
        //         console.log("firebase.init done");

        //     },
        //     error => {
        //         console.log(`firebase.init error: ${error}`);
        //     }
        // );
    }

}
