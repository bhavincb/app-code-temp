import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
    getString,
    setString,
    remove
} from "tns-core-modules/application-settings";
import * as platform from "tns-core-modules/platform";
@Injectable()
export class AuthUserService {
    users = [];
    private token: string = "";
    constructor(
        public url: UrlService,
        private req: RequestService,
    ) {
        console.log('Hello UserService service');
    }
    saveLocalUsers() {
        setString("users", JSON.stringify(this.users))
    }

    loadLocalUsers() {
        let users = getString("users");
        if (users && users != null) {
            this.users = JSON.parse(users);
            return this.users;
        } else {
            return [];
        }
    }
    getUserInfo(userId): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = this.url.users + userId;
            this.req.request(url, {}, 0).then((data) => {
                this.users[userId] = data.body;
                this.saveLocalUsers();
                resolve(data.body)
            }).catch((error) => {
                console.log("getUserInfo", error);
            });
        });
    }
    loginOrSignup(type, email, password, name) {
        let data: any = {};
        if (name) {
            data.name = name;
        }

        data.username = email;
        data.password = password;
        // data.deviceId = platform.device.uuid;
        return this.req.loginOrSignup(data, type).then((success) => {
            console.log("success login or signup", success);
            return Promise.resolve(success);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }
}
