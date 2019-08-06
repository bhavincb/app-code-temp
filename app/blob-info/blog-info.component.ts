import { RouterExtensions } from 'nativescript-angular/router';
import { BlogService } from './../services/blog/blog.service';
import { SharedDataService } from './../services/shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { TextField } from "tns-core-modules/ui/text-field";
import { TextView } from "tns-core-modules/ui/text-view";
import { ScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { Page } from "tns-core-modules/ui/page";
import * as SocialShare from "nativescript-social-share";
import {
    AndroidApplication,
    AndroidActivityBackPressedEventData
} from "tns-core-modules/application";
import * as application from "tns-core-modules/application";
// import * as Keyboard from "nativescript-keyboardshowing";
/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "blog-info", loadChildren: "./blog-info/blog-info.module#BlogInfoModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "BlogInfo",
    moduleId: module.id,
    templateUrl: "./blog-info.component.html",
    styleUrls: ["./blog-info.component.css"]
})
export class BlogInfoComponent implements OnInit {
    blog: any;
    title: string;
    isLoading: boolean;
    isLoadedClicked: boolean;
    commentText: string = "";
    isCommentDisabled = true;
    commentHintText = "Reply to the post";
    selectedComment: any = null;
    constructor(
        private route: ActivatedRoute,
        private data: SharedDataService,
        private blogUtil: BlogService,
        private cd: ChangeDetectorRef,
        private router: RouterExtensions,
        private page: Page,
        private zone: NgZone,
    ) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        this.blog = this.data.blogInfo.post;
        this.title = this.data.blogInfo.title;
        if (this.blog.comment_count == undefined) {
            this.blogUtil.loadPost(this.blog).then((data) => {
                this.blog = data.blog;
            });
        }
        // this.page.on(Page.unloadedEvent, event => {
        //     if (application.android) {
        //         application.android.off(
        //             application.AndroidApplication.activityBackPressedEvent
        //         );
        //     }
        // });
        // this.page.on(Page.loadedEvent, event => {
        //     if (application.android) {
        //         application.android.on(
        //             AndroidApplication.activityBackPressedEvent,
        //             (data: AndroidActivityBackPressedEventData) => {
        //                 this.zone.run(() => {
        //                     this.backEvent(data);
        //                 });
        //             }
        //         );
        //     }
        // });
    }
    backEvent(args: AndroidActivityBackPressedEventData) {
        let commentBox = <TextView>this.page.getViewById("commentBox");
        if (this.selectedComment != null) {
            this.commentBoxBlur(args);
            args.cancel = true;
        }
    }
    onScroll(args: ScrollEventData) {
        // console.log("scrollY: " + args.scrollY);
        if (!this.blog.isCommentsLoaded) {
            let scrollView: ScrollView = <ScrollView>args.object;
            if (args.scrollY >= scrollView.scrollableHeight - 20) {
                this.loadComments();
            }
        }
    }
    loadComments() {
        this.isLoadedClicked = true;
        // console.log("comments", this.blog.comments);
        if (this.blog.isCommentsLoaded) {
            return;
        }
        this.isLoading = true;
        this.blogUtil.getComments(this.blog).then((results) => {
            this.zone.run(() => {
                this.isLoading = false;
                this.cd.detectChanges();
            })
        });
    }

    share() {
        SocialShare.shareText(this.blog.title.rendered + ": " + this.blog.link);
    }
    goBack() {
        this.router.backToPreviousPage();
    }
    doSelectReplyComment(comment) {
        let commentBox = <TextView>this.page.getViewById("commentBox");
        this.commentHintText = "Reply to " + comment.author_name + "'s comment";
        this.selectedComment = comment;
        commentBox.focus();
    }

    commentBoxBlur(args) {
        this.commentHintText = "Reply to the post";
        this.selectedComment = null;
    }
    commentChange(args) {
        let textField = <TextField>args.object;
        this.commentText = textField.text;
        if (this.commentText == undefined || this.commentText == "" || this.commentText.trim().length == 0) {
            this.isCommentDisabled = true;
        } else {
            this.isCommentDisabled = false;
        }
    }
    doComment() {
        let commentText = this.commentText.trim();

        this.isLoading = true;
        let parentId = this.selectedComment ? this.selectedComment.id : 0;
        this.blogUtil.createComment(this.blog, commentText, parentId).then((comment) => {

            this.zone.run(() => {

                this.commentText = "";
                console.log("Comment added to blog.")
                this.blog.comments.push(comment);
                this.loadComments();
                this.isLoading = false;
                this.cd.detectChanges();
            })
        }).catch((e) => {

        });
    }
    goToAutorInfo(author) {
        this.blogUtil.selectedAuthorId = author.id;
        this.router.navigate(['/author-info']);
    }
}
