import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
// import { ListViewLinearLayout, ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { Page } from "tns-core-modules/ui/page";
import { SettingService } from './../services/setting/setting.service';
import { UrlService } from './../services/url/url.service';
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { action, ActionOptions, inputType, capitalizationType, prompt, PromptOptions, PromptResult, confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    constructor(
        public settingUtil: SettingService,
        private router: RouterExtensions,
        public url: UrlService
    ) {

    }
    ngOnInit() {

    }
    goBack() {
        this.router.backToPreviousPage();
    }
    showOptions() {
        let actions = ['Card View', 'List View'];
        let options = {
            title: "Select Option",
            cancelButtonText: "Cancel",
            actions: actions
        };
        action(options).then((result) => {
            if (result == "Card View") {
                this.settingUtil.setView(0);
            } else if (result == "List View") {
                this.settingUtil.setView(1);
            }
        });
    }
    promptAppBase() {
        let options: PromptOptions = {
            title: "Base URL",
            defaultText: this.url.base,
            // message: "How you doin'",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            // neutralButtonText: "Neutral",
            cancelable: true,
            inputType: inputType.text, // email, number, text, password, or email
            capitalizationType: capitalizationType.sentences // all. none, sentences or words
        };

        prompt(options).then((result: PromptResult) => {
            console.log("Hello, " + result.text);
            if (result.text != this.url.base) {
                this.url.setBase(result.text);
                this.cofirmBaseChange();
            }
        });
    }
    cofirmBaseChange() {
        let options = {
            title: "Reload App",
            message: "Do you want to reload app with new base?",
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };

        confirm(options).then((result: boolean) => {
            console.log(result);
            console.log(this.url.base);
            if (result) {
                this.router.navigate(['/'], { clearHistory: true });
            }
        });

    }
}
