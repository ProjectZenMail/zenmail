import {Component, AfterViewInit, ChangeDetectorRef, ViewChild, EventEmitter, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DialogPosition, MdDialogRef, MdIconRegistry} from '@angular/material';
import {TdMediaService, TdSearchBoxComponent} from '@covalent/core';
import {MdDialog} from '@angular/material';
import {NewMessageComponent} from "../new_message/new_message.component";
import {LoginComponent} from "../login/login.component";
import {UserInfoService} from "../../services/user-info.service";
import {InboxComponent} from "../inbox/inbox.component";
import {SearchService} from "../../services/api/search.service";

@Component({
    selector: 's-login-pg',
    templateUrl: './testpage.component.html',
    styleUrls: ['./testpage.component.scss']
})
export class TestpageComponent implements AfterViewInit {

    public userAvatar: any = {
        size: 40, // default size is 100
        fontColor: '#FFFFFF',
        border: "2px solid #d3d3d3",
        isSquare: false, // if it is true then letter avatar will be in square defaule value is false
        text: "", //
        fixedColor:true //if you enable true then letter will have same color for ever default value is false
    };

    sidenavopened = true;
    weekday = new Date().toLocaleString('en-US', {weekday: 'long'});
    year = new Date().toLocaleString('en-US', {year: 'numeric'});
    month = new Date().toLocaleString('en-US', {month: 'long'});
    day = new Date().toLocaleString('en-US', {day: 'numeric'});
    dialogRef;

    routes: Object[] = [
        {
            title: 'Inbox',
            route: '/home/inbox',
            icon: 'email',
        }, {
            title: 'Sent',
            route: '/home',
            icon: 'send',
        }, {
            title: 'Starred',
            route: '/home',
            icon: 'star'
        }, {
            title: 'Drafts',
            route: '/home',
            icon: 'drafts',
        }, {
            title: 'Trash',
            route: '/home',
            icon: 'delete',
        },  {
            title: 'Spam',
            route: '/home',
            icon: 'block',
        }
    ];

    public userEmail: string = "";
    public userName: string = "";


    constructor(public media: TdMediaService,
                private _iconRegistry: MdIconRegistry,
                private _domSanitizer: DomSanitizer,
                private _changeDetectorRef: ChangeDetectorRef,
                public dialog: MdDialog,
                private userInfoService: UserInfoService,
                private searchService : SearchService) {
        this.userEmail = this.userInfoService.getUserEmail();
        this.userName = this.userInfoService.getUserName();
        this.userAvatar.text = this.userEmail;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.media.broadcast();
            this._changeDetectorRef.detectChanges();
        });
    }

    toggleSideNav(): void {
        this.sidenavopened = !this.sidenavopened;
    }

    composeMail(): void {
        this.dialogRef = this.dialog.open(NewMessageComponent, {
            height: '70%',
            width: '70%',
            disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }


    @ViewChild(TdSearchBoxComponent) searchBox;
    search(): void {
        this.searchService.search(this.searchBox.value);
    }

}