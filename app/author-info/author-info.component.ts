
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { View } from 'tns-core-modules/ui/core/view';
import { screen } from 'tns-core-modules/platform';
import { SharedDataService } from './../services/shared-data/shared-data.service';
import { Observable } from 'tns-core-modules/data/observable';
import { BlogService } from './../services/blog/blog.service';
import { CategoryService } from './../services/category/category.service';
import { SettingService } from './../services/setting/setting.service';
import { layout } from 'tns-core-modules/utils/utils';
// import { ListViewLinearLayout, ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
@Component({
    selector: "AuthorInfo",
    moduleId: module.id,
    templateUrl: "./author-info.component.html",
    styleUrls: ['./author-info.component.css']
})
export class AuthorInfoComponent implements OnInit {
    catID: number | string = '';
    searchText: string = '';
    imageSize = layout.toDevicePixels(144);
    currentPage: number = 1;
    totalPages: number = 0;
    authorId = 0;
    author: any;
    catList = [];
    isCatLoaded = new Observable();
    menusList = [];
    blogs: Array<any> = [];
    isLoadingData = false;
    private isDoSearchManual = false;
    constructor(
        private blogUtil: BlogService,
        public catUtil: CategoryService,
        public settingUtil: SettingService,
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
        //use pre loaded categories list from the dataStore
        this.authorId = this.blogUtil.selectedAuthorId;
        this.author = this.blogUtil.authors[this.authorId];
        this.catList = this.catUtil.loadLocalCategories();
        this.loadPosts();
    }
    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
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
    loadPosts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.isLoadingData = true;
            if (this.currentPage == 1) {
                this.blogs = [];
            }
            this.blogUtil.loadPosts(this.catID, this.currentPage, this.searchText, this.authorId).then((data) => {
                this.zone.run(() => {
                    if (this.currentPage == 1) {
                        this.blogs = data.blogs;
                    } else {
                        data.blogs.forEach((blog) => {
                            this.blogs.push(blog);
                        });
                    }
                    console.log("bogLoaded llength:", this.blogs.length)
                    this.isLoadingData = false;
                    this.totalPages = data.totalPages;
                });
                resolve(this.blogs);
            });
        });

    }

    loadNextPage(args) {
        // console.log("load more data called", this.isLoadingData || this.currentPage >= this.totalPages);
        // console.log(this.totalPages)
        // console.log("curr", this.currentPage)
        // console.log(this.isLoadingData)
        if (this.isLoadingData || this.currentPage >= this.totalPages) {
            args.returnValue = false;
        } else {
            // let listView: RadListView = args.object;
            this.isLoadingData = true;
            this.currentPage = this.currentPage + 1;
            this.loadPosts().then(() => {
                this.zone.run(() => {
                    // listView.notifyLoadOnDemandFinished();;
                });
            });
            args.returnValue = true;
        }
    }
    getCatNames(post) {
        // if (post.catNames && post.catNames.indexOf("undefined") != -1) {
        //     console.log("undefined id", post.id)
        // }
        // if (post.id == 46) {
        //     console.log("postcars", post.catNames)
        // }   
        if (this.catUtil.categories.length > 0) {
            if (post.catNames) {
                return post.catNames;
            } else {
                post.catNames = this.generateCatNames(post);
                return post.catNames;
            }
        }
    }
    generateCatNames(post) {
        let flag = false;
        post.categories.forEach((catId) => {
            let innerFlag = false;
            for (let i = 0; i < this.catUtil.categories.length; i++) {
                if (catId == this.catUtil.categories[i].id) {
                    if (this.catUtil.categories[i].name == undefined) {
                        console.log("not working")
                    }
                    this.zone.run(() => {
                        post.catNames = !post.catNames ? this.catUtil.categories[i].name : post.catNames + ', ' + this.catUtil.categories[i].name;;
                    });
                    if (post.id == 46) {
                        console.log("postcars", post.catNames)
                    }
                    innerFlag = true;
                    break;
                }
            }
            if (!innerFlag) {
                this.catUtil.getCategory(catId).then((cat) => {

                    this.zone.run(() => {
                        if (!post.catNames) {
                            post.catNames = cat.name;
                        } else {
                            if (post.catNames.indexOf(cat.name) == -1) {
                                post.catNames = post.catNames + ', ' + cat.name;
                            }
                        }
                        // post.catNames = !post.catNames ? cat.name : post.catNames.indexOf(cat.name)==-1? post.catNames + ', ' + cat.name:'';    
                    })

                });
            }
        });
        if (post.categories.length == 0) {
            post.catNames = "No category"
        }
        return post.catNames;
    }
    goToBlogInfo(post) {
        this.data.blogInfo = {
            post: post,
            id: post.id,
            title: post.title.rendered
        }
        this.router.navigate(['/blog-info'])
    }
    goBack() {
        this.router.backToPreviousPage();
    }
}