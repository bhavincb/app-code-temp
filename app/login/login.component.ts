import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { UrlService } from './../services/url/url.service';
import { AuthUserService } from './../services/auth-user/auth-user.service';
import { LoadingIndicator } from './../nativescript-loading-indicator';
import { RouterExtensions } from 'nativescript-angular/router';
import { UserService } from './../services/user/user.service';
import { RequestService } from './../services/request/request.service';
import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import * as platform from "tns-core-modules/platform";
import * as utils from "tns-core-modules/utils/utils";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import * as application from "tns-core-modules/application";
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import * as bghttp from "nativescript-background-http";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { PropertyValidator, DataFormEventData } from "nativescript-ui-dataform";
import { RadDataForm } from "nativescript-ui-dataform";
import { registerElement } from "nativescript-angular/element-registry";
import { Color } from "tns-core-modules/color";
import { SettingService } from './../services/setting/setting.service';
declare var android: any;
/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "login", loadChildren: "./login/login.module#LoginModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    page: number = 0;
    email = new InputData();
    password = new InputData();
    userAlias;
    private token;
    isErrorVisible = false;
    loading: LoadingIndicator;
    errorText: string;
    // loading:Loading;
    type = "login";
    private _user = {
        email: "",
        password: ""
    };

    get userSource() {
        return this._user;
    }
    @ViewChild("signInForm", { static: false }) dataFormComp: RadDataFormComponent;
    constructor(
        private req: RequestService,
        private user: UserService,
        private url: UrlService,
        private userReq: AuthUserService,
        private currentPage: Page,
        private routerExtensions: RouterExtensions,
        private settingReq: SettingService,
        private cd: ChangeDetectorRef,
        private zone: NgZone,
    ) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
        this.currentPage.actionBarHidden = true;
        this.currentPage.on(Page.loadedEvent, event => {
            if (platform.isAndroid) {
                application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                    this.zone.run(() => {
                        this.backEvent(data);
                    });

                });
                const sideDrawer = <RadSideDrawer>application.getRootView();
                if (sideDrawer) {
                    sideDrawer.gesturesEnabled = false;
                }

            }
        });

        this.currentPage.on(Page.unloadedEvent, event => {
            if (application.android) {
                application.android.off(application.AndroidApplication.activityBackPressedEvent);
            }
            const sideDrawer = <RadSideDrawer>application.getRootView();
            if (sideDrawer) {
                sideDrawer.gesturesEnabled = true;
            }
        });
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        // this._user = new User();
    }
    backEvent(args: AndroidActivityBackPressedEventData) {
        if (this.page > 0) {
            this.page = 0;
            if (this.settingReq.settings.isLoginRequired) {
                args.cancel = true;
            }

        }
    }
    goToForgotPassword() {
        // this.setPage(2);
        // this.forgotPassword();
    }
    goToNext() {
        if (!this.hasErrors()) {
            if (this.page == 0) {
                this.doLogin();
            }
        }
    }
    public hasErrors() {
        var hasErrors = this.dataFormComp.dataForm.hasValidationErrors();
        // this.resultLabel.nativeElement.text = hasErrors;
        return hasErrors;
    }



    doLogin() {
        if (platform.isAndroid) {
            utils.ad.dismissSoftInput();
        }

        let loading = new LoadingIndicator();
        loading.show({
            message: 'Please wait...',
        });
        let data: any = {};
        let type;
        if (this.type == "login") {
            type = 0;
        } else {
            type = 1;
        }

        this.userReq.loginOrSignup(type, this._user.email, this._user.password, '').then((data) => {
            console.log("success login or signup", data);
            let user = data;

            this.user.saveUser(user);
            loading.hide();
            if (this.settingReq.settings.isLoginRequired) {
                this.goToHome();
            } else {
                this.goBack();
            }


        }).catch((error) => {
            console.log("login error", error);
            this.showError(error);
            loading.hide();
        });
    }



    showError(message) {
        this.errorText = message;
        this.isErrorVisible = true;
        setTimeout(() => {
            this.zone.run(() => {
                this.isErrorVisible = false;
            });
        }, 2000)
    }
    goToLogin() {
        this.type = "login";
        // this.setPage(0);
    }
    goToHome() {
        this.routerExtensions.navigate(['/home'], { clearHistory: true });
    }
    goBack() {
        this.routerExtensions.back();
    }
}
class InputData {
    value: string = "";
    valid = false;
}
