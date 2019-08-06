import { RouterExtensions } from 'nativescript-angular/router';
import { UserService } from './../services/user/user.service';
import { SettingService } from './../services/setting/setting.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private user: UserService,
        private router: RouterExtensions,
        private settingReq: SettingService,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log("auth gaurd chekc")
        if (this.user.checkLogin() || !this.settingReq.settings.isLoginRequired) {
            console.log("authgaurd check true")
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
