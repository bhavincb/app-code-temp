
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { View } from 'tns-core-modules/ui/core/view';
import { screen } from 'tns-core-modules/platform';
import { SharedDataService } from './../services/shared-data/shared-data.service';
import { isAndroid, isIOS } from "tns-core-modules/platform";

// import { ListViewLinearLayout, ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
@Component({
    selector: "PlaceInfo",
    moduleId: module.id,
    templateUrl: "./place-info.component.html",
    styleUrls: ['./place-info.component.css']
})
export class PlaceInfoComponent implements OnInit {
    place;
    title = "";
    screenHeight = screen.mainScreen.heightDIPs;
    photosHeight = screen.mainScreen.widthDIPs / 3;
    isIOS;
    constructor(
        private zone: NgZone,
        private page: Page,
        private cd: ChangeDetectorRef,
        private data: SharedDataService,
        private router: RouterExtensions,
    ) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
        this.isIOS = isIOS;
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        this.place = this.data.placeInfo.place;
        this.title = this.data.placeInfo.title;
    }
    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View=null) {
        // If the header content is still visiible
        // console.log(scrollView.verticalOffset);
        if (scrollView.verticalOffset < 200) {
            const offset = scrollView.verticalOffset / 2;
            if (scrollView.ios) {
                // iOS adjust the position with an animation to create a smother scrolling effect. 
                topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
            } else {
                // Android, animations are jerky so instead just adjust the position without animation.
                topView.translateY = Math.floor(offset);
            }
        }
    }

    generateImagesRowString(place) {
        if (place.imagesRows) {
            return place.imagesRows;
        }
        place.imagesRows = "auto";
        let temp = 0;
        if (place.images.length % 3 == 0) {
            temp = place.images.length / 3;
        } else {
            temp = (place.images.length + (3 - place.images.length % 3)) / 3
        }
        for (let i = 1; i < temp; i += 1) {
            place.imagesRows += ",auto";
        }
        return place.imagesRows;
    }
    goBack() {
        this.router.backToPreviousPage();
    }
}