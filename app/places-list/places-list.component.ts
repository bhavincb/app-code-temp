import { ListViewLinearLayout, ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { PlaceService } from './../services/place/place.service';
import { SharedDataService } from './../services/shared-data/shared-data.service';
import { isAndroid, isIOS, } from "tns-core-modules/platform";

import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
@Component({
    selector: "PlacesList",
    moduleId: module.id,
    templateUrl: "./places-list.component.html",
    styleUrls: ['./places-list.component.css']
})
export class PlacesListComponent implements OnInit {
    pageTitle = "Places";
    places = new ObservableArray<any>([]);

    currentPage: number = 1;
    totalPages: number = 0;

    // searchActive: boolean = false;
    isLoadingData = false;

    catId = "";
    searchText = "";
    constructor(
        // private blogUtil: BlogService,
        // public catUtil: CategoryService,
        public placeUtil: PlaceService,
        private zone: NgZone,
        private page: Page,
        private cd: ChangeDetectorRef,
        private data: SharedDataService,
        private router: RouterExtensions,
    ) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        // //use pre loaded categories list from the dataStore
        // this.catList = this.catUtil.loadLocalCategories();
        // this.catUtil.loadCategories().then(() => {
        //     this.zone.run(() => {
        //         this.catList = this.catUtil.categories;
        //     })
        // });
        this.loadPlaces();
    }
    loadPlaces(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.isLoadingData = true;
            if (this.currentPage == 1) {
                this.places = new ObservableArray([]);
            }
            this.placeUtil.loadPlaces(this.catId, this.currentPage, this.searchText).then((data) => {
                this.zone.run(() => {
                    if (this.currentPage == 1) {
                        // this.places =data.places;
                        data.places.forEach((place) => {
                            this.places.push(place);
                        });
                    } else {
                        data.places.forEach((place) => {
                            this.places.push(place);
                        });
                    }
                    console.log("placeLoaded llength:", this.places.length)
                    this.isLoadingData = false;
                    this.totalPages = data.totalPages;
                });
                resolve(this.places);
            });
        });

    }

    loadNextPage(args) {
        console.log("load more data called", this.isLoadingData || this.currentPage >= this.totalPages);
        console.log(this.totalPages)
        console.log("curr", this.currentPage)
        console.log(this.isLoadingData)
        if (this.isLoadingData || this.currentPage >= this.totalPages) {
            args.returnValue = false;
        } else {
            let listView: RadListView = args.object;
            this.isLoadingData = true;
            this.currentPage = this.currentPage + 1;
            this.loadPlaces().then(() => {
                this.zone.run(() => {
                    listView.notifyLoadOnDemandFinished();
                });
            });
            args.returnValue = true;
        }
    }
    getCatNames(place) {
        if (place.post_category.length > 0) {
            if (place.catNames) {
                return place.catNames;
            } else {
                place.catNames = this.generateCatNames(place);
                return place.catNames;
            }
        }
    }
    generateCatNames(place) {
        let flag = false;
        let category;
        for (let i = place.post_category.length - 1; i >= 0; i -= 1) {
            category = place.post_category[i];
            place.catNames = !place.catNames ? category.name : place.catNames + ', ' + category.name;
        }
        // place.post_category.forEach((category) => {
        //     place.catNames = !place.catNames ? category.name : place.catNames + ', ' + category.name;

        // });
        if (place.post_category.length == 0) {
            place.catNames = "No category"
        }
        return place.catNames;
    }
    goToPlaceInfo(place) {
        this.data.placeInfo = {
            place: place,
            id: place.id,
            title: place.title.rendered
        }
        this.router.navigate(['/place-info'])
    }
}