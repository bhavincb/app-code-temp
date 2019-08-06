import { RequestService } from './../request/request.service';
import { UrlService } from './../url/url.service';
import { Injectable } from '@angular/core';
import {
    getString,
    setString,
} from "tns-core-modules/application-settings";
@Injectable()
export class MenusService {
    menus: any;
    constructor(
        private url: UrlService,
        private req: RequestService) { }

    saveLocalMenus() {
        setString("menus", JSON.stringify(this.menus))
    }

    loadLocalMenus() {
        let blogs = getString("menus");
        if (blogs && blogs != null) {
            this.menus = JSON.parse(blogs);
            return this.menus;
        } else {
            return {};
        }
    }
    loadMenus(page = 1): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = this.url.primaryMenu;
            this.req.request(url, {}, 0).then((data) => {
                this.menus =this.formatMenus(data.body);
                this.saveLocalMenus();
                resolve(this.menus);
            }).catch((error) => {
                console.log("loadMenus", error);
            });
        });
    }
    formatMenus(menus) {
        let items = [];
        items.push({ elements: menus, parentIndex: -1, depth: 0, parentElementIndex: -1 });
        menus.forEach((menu, i) => {
            menu.depth = 0;
            this.recursiveMenu(menu, items, 0);
        });
        return items;
    }
    recursiveMenu(menu,items,parentIndex) {
        if (menu.children.length > 0){
            menu.childIndex = items.push({ parentIndex: parentIndex, elements: menu.children, depth: items[parentIndex].depth + 1, parentElementIndex: items[parentIndex].elements.indexOf(menu) }) - 1;
            menu.children.forEach((child) => {
                child.depth = menu.depth + 1;
                this.recursiveMenu(child, items, menu.childIndex);
            })
        }
    }
}
