import {Injectable, Inject} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';

import {Observable, Subject} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {UserInfoService, LoginInfoInStorage} from '../user-info.service';
import {ApiRequestService} from './api-request.service';

export interface LoginRequestParam {
    username: string;
    password: string;
}

@Injectable()
export class LoginService {

    public landingPage: string = "/home";

    constructor(private router: Router,
                private http: Http,
                private userInfoService: UserInfoService,
                private apiRequest: ApiRequestService) {
    }


    getToken(username: string, password: string): Observable<any> {
        let me = this;

        let bodyData: LoginRequestParam = {
            "username": username,
            "password": password,
        };
        let loginDataSubject: Subject<any> = new Subject<any>(); // Will use this subject to emit data that we want after ajax login attempt
        let loginInfoReturn: LoginInfoInStorage; // Object that we want to send back to Login Page

        this.apiRequest.post('session', bodyData)
            .subscribe(jsonResp => {
                if (jsonResp !== undefined && jsonResp !== null && jsonResp.operationStatus === "SUCCESS") {
                    //Create a success object that we want to send back to login page
                    loginInfoReturn = {
                        "success": true,
                        "message": jsonResp.operationMessage,
                        "landingPage": this.landingPage,
                        "user": {
                            "userId": jsonResp.item.userId,
                            "email": jsonResp.item.username,
                            "displayName": jsonResp.item.name,
                            "token": jsonResp.item.token,
                        }
                    };

                    // store username and jwt token in session storage to keep user logged in between page refreshes
                    this.userInfoService.storeUserInfo(JSON.stringify(loginInfoReturn.user));
                }
                loginDataSubject.next(loginInfoReturn);

            }, error2 => {
                loginInfoReturn = {
                    "success": false,
                    "message": error2.status,
                    "landingPage": "/login"
                };
                loginDataSubject.next(loginInfoReturn);
            });

        return loginDataSubject;
    }

    logout(navigateToLogout = true): void {
        // clear token remove user from local storage to log user out
        this.userInfoService.removeUserInfo();
        if (navigateToLogout) {
            this.router.navigate(["logout"]);
        }
    }
}
