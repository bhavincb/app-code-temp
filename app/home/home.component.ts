import { RouterExtensions } from 'nativescript-angular/router';
import { Observable } from 'tns-core-modules/data/observable';
import { BlogService } from './../services/blog/blog.service';
import { MenusService } from './../services/menus/menus.service';
import { CategoryService } from './../services/category/category.service';
import { SettingService } from './../services/setting/setting.service';
import { SharedDataService } from './../services/shared-data/shared-data.service';
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as utils from "tns-core-modules/utils/utils";
import { isAndroid, isIOS } from "tns-core-modules/platform";

// import { ListViewLinearLayout, ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { Page } from "tns-core-modules/ui/page";

//Uncomment this for firebase


@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    catID: number | string = '';
    pageTitle: string = 'All';
    searchText: string = '';

    currentPage: number = 1;
    totalPages: number = 0;
    isIOS;
    catList = [];
    isCatLoaded = new Observable();
    menusList = [];
    searchActive: boolean = false;
    blogs: Array<any> = [];
    isLoadingData = false;

    pageIndex = 0;
    // sidedrawer whether user navigated towards child or parent
    isChildNav = true;
    private isDoSearchManual = false;
    constructor(private blogUtil: BlogService,
        public catUtil: CategoryService,
        public menusUtil: MenusService,
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
        this.isIOS = isIOS;
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        //use pre loaded categories list from the dataStore
        this.catList = this.catUtil.loadLocalCategories();
        this.menusList = this.menusUtil.loadLocalMenus();
        this.menusUtil.loadMenus().then(() => {
            this.zone.run(() => {
                this.menusList = this.menusUtil.menus;
                // console.log("menus length:",this.menusList.length)
            })
        });
        this.catUtil.loadCategories().then(() => {
            this.zone.run(() => {
                this.catList = this.catUtil.categories;
            })
        });
        this.loadPosts();
        //Uncomment this for firebase
        // firebase.addOnMessageReceivedCallback((message) => {
        //     console.log("Title: " + message.title);
        //     console.log("Body: " + message.body);
        //     console.dir(message.data);
        //     // if your server passed a custom property called 'foo', then do this:
        //     // console.log("Value of 'foo': " + message.data.foo);
        //     if (message.foreground) {
        //         this.goToBlogInfo({ id: message.data.id, title: { rendered: message.data.title } });
        //         // this.goToMenuLink(message.data);
        //     } else {
        //         this.loadPosts().then(() => {
        //             // this.isLoadingData=false;
        //             console.log("notification data recieved in home");
        //             this.goToBlogInfo({ id: message.data.id, title: { rendered: message.data.title } })
        //             // this.goToMenuLink(message.data);
        //         });
        //     }
        // });
    }
    loadPosts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.isLoadingData = true;
            if (this.currentPage == 1) {
                this.blogs = [];
            }
            this.blogUtil.loadPosts(this.catID, this.currentPage, this.searchText).then((data) => {
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
    searchToggle() {
        // console.log("search toofle");
        if (this.searchActive) {
            if (this.searchText) {
                this.searchText = "";
                let searchBar: any = this.page.getViewById("searchBar");
                searchBar.text = "";
                this.pageTitle = "All";
                this.refreshBlogPosts();
            }
            this.searchActive = false;
        } else {
            let searchBar: any = this.page.getViewById("searchBar");
            searchBar.text = this.searchText;
            this.searchActive = true;
            setTimeout(() => {
                searchBar.focus();
            }, 300);
        }
    }
    doSearch(args) {
        let searchText = args.object.text.trim();
        console.log("searchText", searchText);
        if (searchText) {
            this.catID = '';
            this.pageTitle = 'Search: ' + searchText;
            this.searchText = searchText;
            args.object.text = "";
            this.isDoSearchManual = true;
            this.searchActive = false;
            this.refreshBlogPosts();
        } else {
            if (!this.isDoSearchManual && this.searchText) {
                this.searchToggle();
            } else {
                this.isDoSearchManual = false;
                this.searchActive = false;
            }

        }
        console.log(this.pageTitle)
        if (searchText) {
            console.log("orking", searchText);
        }
    }
    refreshBlogPosts() {
        this.blogs = [];
        this.currentPage = 1;
        this.totalPages = 0;
        this.isLoadingData = true;
        this.loadPosts();
    }
    loadCatPosts(cat, isDrawerClick = true) {
        this.isLoadingData = true;
        this.catID = cat.id;
        this.pageTitle = cat.name;
        this.searchText = "";
        let searchBar: any = this.page.getViewById("searchBar");
        searchBar.text = "";
        this.searchActive = false;
        this.refreshBlogPosts();
        if (isDrawerClick) {
            this.onDrawerButtonTap();
        }

    };
    onDrawerButtonTap() {
        let drawer: any = this.page.getViewById("drawer");
        drawer.toggleDrawerState();
        this.cd.detectChanges();
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
                    if (post.id == 46) {
                        console.log("pre postcats is", post.catNames)
                        console.log("pre cat id", catId);
                        console.log("pre cat names", cat.name);
                    }
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
                    if (post.id == 46) {
                        console.log("postcats", post.catNames)
                        console.log("cat id", catId);
                        console.log("cat names", cat.name);
                    }
                });
            }
        });
        if (post.categories.length == 0) {
            post.catNames = "No category"
        }
        return post.catNames;
    }
    generateRows(no) {
        let str = "";
        while (no > 0) {
            if (no == 1) {
                str = str + "auto";
            } else {
                str = str + "auto,";
            }
            no -= 1;
        }
        return str;
    }
    selectChildPage(element) {
        if (element.children.length > 0) {

            this.isChildNav = true;
            this.pageIndex = element.childIndex;
        }
        // console.log("elementtitle:",element.title)
    }
    selectParentPage(menu) {
        this.isChildNav = false;
        this.pageIndex = menu.parentIndex
    }
    goToMenuLink(menuItem) {
        if (menuItem.object == "post" && menuItem.type == "post_type") {
            this.goToBlogInfo({ id: menuItem.object_id, title: { rendered: menuItem.title } })
        } else if (menuItem.object == "custom" && menuItem.type == "custom") {
            utils.openUrl(menuItem.url);
        } else if (menuItem.object == "category" && menuItem.type == "taxonomy") {
            this.loadCatPosts({ id: menuItem.object_id, name: menuItem.title });
        } else if (menuItem.object == "page" && menuItem.type == "post_type") {
            this.goToGdPageInfo({ id: menuItem.object_id, title: { rendered: menuItem.title } })
        }
    }
    goToBlogInfo(post) {
        this.searchActive = false;
        this.data.blogInfo = {
            post: post,
            id: post.id,
            title: post.title.rendered
        }
        this.router.navigate(['/blog-info'])
    }
    goToGdPageInfo(page) {
        this.searchActive = false;
        this.data.gdPageInfo = {
            page: page,
            id: page.id,
            title: page.title.rendered
        }
        this.router.navigate(['/gd-page'])
    }
    goToAutorInfo(author) {
        this.blogUtil.selectedAuthorId = author.id;
        this.router.navigate(['/author-info']);
    }
    goToSettings() {

        this.router.navigate(['/settings'])
    }
}
