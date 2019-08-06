import { Injectable } from '@angular/core';
@Injectable()
export class UrlService {

    // public base = "https://ppldb.com/v2/wp-json/";
    public base = "https://www.newcastle-county-down.com/wp-json/";
    public login = this.base + "jwt-auth/v1/token";
    public wpBase = this.base + "wp/v2/";
    public appWpBase = this.base + "appwp/v2/";
    public settings = this.appWpBase + "settings/";
    public geoBase = this.base + "geodir/v2/";
    public posts = this.wpBase + "posts/";
    public pages = this.wpBase + "pages/";
    public users = this.wpBase + "users/";
    public media = this.wpBase + "media/";
    public categories = this.wpBase + "categories/";
    public comments = this.wpBase + "comments/";
    public tags = this.geoBase + "places/tags/";
    public places = this.geoBase + "places/";
    public placeCategories = this.geoBase + "places/categories/";
    // public primaryMenu = this.appWpBase + "menu-locations/appwp";
    public primaryMenu = this.appWpBase + "menu-locations/appwp";
    constructor() {

    }
    setBase(url) {
        this.base = url;
        this.login = this.base + "jwt-auth/v1/token";
        this.wpBase = this.base + "wp/v2/";
        this.appWpBase = this.base + "appwp/v2/";
        this.settings = this.appWpBase + "settings/";
        this.geoBase = this.base + "geodir/v2/";
        this.posts = this.wpBase + "posts/";
        this.pages = this.wpBase + "pages/";
        this.users = this.wpBase + "users/";
        this.media = this.wpBase + "media/";
        this.categories = this.wpBase + "categories/";
        this.comments = this.wpBase + "comments/";
        this.tags = this.geoBase + "places/tags/";
        this.places = this.geoBase + "places/";
        this.placeCategories = this.geoBase + "places/categories/";
        // this.primaryMenu = this.appWpBase + "menu-locations/appwp";
        this.primaryMenu = this.appWpBase + "menu-locations/appwp";
    }

}
