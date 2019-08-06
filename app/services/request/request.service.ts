import { RouterExtensions } from 'nativescript-angular/router';
import { UrlService } from './../url/url.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as application from "tns-core-modules/application";
import { Http, Headers, RequestOptions, Response, Request } from '@angular/http';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import {
    remove,
    clear
} from "tns-core-modules/application-settings";
declare var android: any;
@Injectable()
export class RequestService {

    constructor(
        private http: HttpClient,
        private url: UrlService,
        private user: UserService,
        private router: RouterExtensions,
    ) {
        console.log('Hello RequestProvider Provider');
    }
    loginOrSignup(data, type): Promise<any> {

        let url;
        if (type == 0) {
            url = this.url.login;
        } else {
            // url = this.url.signup;
        }
        console.log("login or signup url", url)
        return this.http.post(url, data, {})
            .toPromise()
            .catch((error) => {
                console.log("login error", error);
                return this.errorHandler(error);
            });
    }
    request(url, data, type, isAuth = this.user.isLoginRequired): Promise<any> {
        // default authentication set to false
        //uncomment when using token authentication
        if (this.user.token == undefined && isAuth) {
            this.goToLogin();
            return Promise.reject("token is not defined yet");
        }
        if (type == 0) {
            return this.get(url, data, isAuth);
        }
        else if (type == 1) {
            if (this.user.isLoggedIn && this.user.token != undefined) {
                return this.post(url, data, true);
            } else {
                this.goToLogin();
                return Promise.reject("User is not logged in");
            }

        }
    }

    private get(url, data, isAuth): Promise<any> {
        let headers: HttpHeaders;
        if (isAuth) {
            //change to new HttpHeaders().set( 'Authorization', 'Bearer ' + this.user.token ) when using token authentication
            headers = new HttpHeaders()

        } else {
            headers = new HttpHeaders();
        }


        return this.http.get(url, { headers: headers, observe: 'response' })
            .toPromise()
            .catch((error) => {
                return this.errorHandler(error);
                // return Promise.reject(error);
            });
    }

    private post(url, data, isAuth): Promise<any> {
        let headers: HttpHeaders;
        if (isAuth) {
            //change to new HttpHeaders().set( 'Authorization', 'Bearer ' + this.user.token ) when using token authentication
            headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.user.token)
        } else {
            headers = new HttpHeaders();
        }
        console.log("Headers using:", headers.get('Authorization').toString())
        return this.http.post(url, data, { headers: headers, observe: 'response' })
            .toPromise()
            .catch((error) => {
                this.errorHandler(error);
                return Promise.reject(error);
            });
    }

    private goToLogin() {
        this.router.navigate(['login']);
    }

    private errorHandler(error) {
        console.log("error", error)
        if (error.status == 401) {
            //uncomment when using authentication
            // this.logout();
            return Promise.reject(error);
        } else if (error.status == 0) {
            android.widget.Toast.makeText(application.android.context, "Network connectivity failed. please check your internet connection.", android.widget.Toast.LENGTH_LONG).show();
            return Promise.reject("Internet Connection is Not working.");
        } else if (error.status == 404) {
            // android.widget.Toast.makeText(application.android.context, "No route was found matching the URL and request method. This might be solved after updating the App.", android.widget.Toast.LENGTH_LONG).show();
            alert("No route was found matching the URL and request method. This might be solved after updating the App.");
            return Promise.reject("No route was found matching the URL and request method.");
            //uncomment when using authentication
            // this.logout();
        } else {
            return Promise.reject(error);
        }
    }
    //uncomment when using authentication
    // logout(): void {
    // clear token remove user from local storage to log user out

    // this.user.logout();
    // this.router.navigate(['/login'],{
    //   clearHistory: true
    // });

    // remove('blogs');
    // }
}

