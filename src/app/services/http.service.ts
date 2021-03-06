import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  base = "https://api.achuhealth.com";
  accessToken = null;
  refreshToken = null;
  email = "";
  tenantId = "";
  user = <any>{};
  userSicknessData = <any>{};
  currentLat = 43.996541;
  currentLng = -78.185234;
  userDefaults = <any>{};
  userSettings = <any>{};
  callCount = 0;
  constructor(public http: HttpClient, private storage: StorageService, public router: Router, public loadingService: LoadingService) { }

  async post(endpoint, data) {
    let url = this.base + endpoint;
    let headers = {};
    let access = await this.getAccessToken();
    if (!access)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + access, "TenantId": this.tenantId };
    let config = <any>{
      url: url,
      method: "POST",
      headers: headers,
      observe: 'response'
    }
    try {
      let response = await <any>this.http.post(url, data, config).toPromise();
      if (response.status == 200) {
        return response;
      } else {
        this.logout();
      }
    } catch (e) {
      if (e.status == 401) {
        let response = await this.refreshTokens();

        if (response.status == 200) {
          response = await this.post(endpoint, data);

          if (response.status != 200) {
            // logout
            await this.logout();
          } else {
            return response;
          }
        } else {
          // log out
          await this.logout();
        }
      }
    }
  }

  async put(endpoint, data) {
    let url = this.base + endpoint;
    let headers = {};
    let access = await this.getAccessToken();
    if (!access)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + access, "TenantId": this.tenantId };
    let config = {
      url: url,
      method: "PUT",
      headers: headers
    }
    try {
      let response = await <any>this.http.put(url, data, config).toPromise();
      if (response.status == 200) {
        return response;
      } else if (response.status == 401) {
        response = await this.refreshTokens();

        if (response.status == 200) {
          response = await this.put(endpoint, data);

          if (response.status != 200) {
            // logout
            await this.logout();
          } else {
            return response;
          }
        } else {
          // log out
          await this.logout();
        }
      } else {
        this.logout();
      }
    } catch (e) {
      return e;
    }
  }

  async get(endpoint, data) {
    let url = this.base + endpoint;
    let headers = {};
    let dateOffset = new Date().getTimezoneOffset() * (-60);
    let d = dateOffset.toString();
    let access = await this.getAccessToken();
    if (!access)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "DateOffset": d };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + access, "TenantId": this.tenantId, "DateOffset": d };

    try {
      let response = await <any>this.http.get(url, {
        headers: headers,
        params: data,
        observe: 'response'
      }).toPromise();
      if (response.status == 200) {
        return response;
      } else {
        this.logout();
      }
    } catch (e) {
      if (e.status == 401) {
        let response = await this.refreshTokens();

        if (response.status == 200) {
          response = await this.get(endpoint, data);

          if (response.status != 200) {
            // logout
            await this.logout();
          } else {
            return response;
          }
        } else {
          // log out
          await this.logout();
        }
      }
    }
  }

  async delete(endpoint) {
    let url = this.base + endpoint;
    let headers = {};
    let access = await this.getAccessToken();
    if (!access)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + access, "TenantId": this.tenantId };

    try {
      let response = await <any>this.http.delete(url, {
        headers: headers
      }).toPromise();
      if (response.status == 200) {
        return response;
      } else {
        this.logout();
      }
    } catch (e) {
      if (e.status == 401) {
        let response = await this.refreshTokens();

        if (response.status == 200) {
          response = await this.delete(endpoint);

          if (response.status != 200) {
            // logout
            await this.logout();
          } else {
            return response;
          }
        } else {
          // log out
          await this.logout();
        }
      }
    }
  }

  async getRefreshToken() {
    this.refreshToken = await this.storage.getItem("refreshToken");
    return this.refreshToken;
  }

  async setRefreshToken(key) {
    this.refreshToken = key;
    key = JSON.stringify(key);
    await this.storage.setItem({ key: "refreshToken", value: key });
  }

  async getAccessToken() {
    this.accessToken = await this.storage.getItem("accessToken");
    return this.accessToken;
  }

  async setAccessToken(key) {
    this.accessToken = key;
    key = JSON.stringify(key);
    await this.storage.setItem({ key: "accessToken", value: key });
  }

  async refreshTokens() {
    let headers = {};
    let accessToken = await this.getAccessToken();
    if (!accessToken)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + this.accessToken, "TenantId": this.tenantId };
    let config = <any>{
      url: this.base + "/auth/Auth/Tokens",
      method: "POST",
      headers: headers,
      observe: 'response'
    }
    let token = await this.getRefreshToken();

    try {
      let response = <any>await this.http.post(this.base + "/auth/Auth/Tokens", {
        email: this.email,
        accessToken: accessToken,
        refreshToken: token,
        tenantId: this.tenantId
      }, config).toPromise();

      await this.setAccessToken(response.body.accessToken);
      await this.setRefreshToken(response.body.refreshToken);
      let loginResponse = { key: "loggedIn", value: JSON.stringify(response.body) };
      await this.storage.setItem(loginResponse);
      return response;
    } catch (error) {
      return error
    }
  }

  async setUserCreds(obj) {
    await this.setAccessToken(obj.accessToken);
    await this.setRefreshToken(obj.refreshToken);

    this.email = obj.email;
    this.tenantId = obj.tenantId;

    await this.loadAccountData();
    await this.loadSicknessData();
    await this.loadUserDefaults();
  }

  async getUserEmail() {
    return this.email;
  }

  async loadAccountData() {
    let response = await this.get("/api/Account/GetUserInfo", {
      tenantId: this.tenantId
    });
    if (response.status == 200) {
      this.user = response.body;
    } else {
      await this.logout();
    }
  }

  async loadSicknessData() {
    let response = await this.get("/api/Sickness", {});

    if (response.status == 200) {
      this.userSicknessData = response.body;
    } else {
      await this.logout();
    }
  }

  async loadUserDefaults() {
    let response = await this.get("/api/Account/UserDefaults", {});

    if (response.status == 200) {
      this.userDefaults = response.body;
    } else {
      await this.logout();
    }
  }

  async getSickScanData(day) {
    let minLon, maxLon, minLat, maxLat = 0;
    let currentLat = this.currentLat;
    let currentLon = this.currentLng;
    maxLat = currentLat + (180 / Math.PI) * (500000 / 6378137);
    maxLon = currentLon + (180 / Math.PI) * (500000 / 6378137) / Math.cos(Math.PI / 180.0 * currentLat);
    minLat = currentLat + (180 / Math.PI) * (-500000 / 6378137);
    minLon = currentLon + (180 / Math.PI) * (-500000 / 6378137) / Math.cos(Math.PI / 180.0 * currentLat);

    let response = await this.get("/sickscan/Data", {
      dateOffset: day.getTime(),
      minLon: minLon,
      maxLon: maxLon,
      minLat: minLat,
      maxLat: maxLat
    });

    if (response.status == 200) {
      return response.body;
    } else {
      await this.logout();
    }
  }

  async getSicknessDetails(report) {
    let response = await this.get("/api/Sickness/Details", {
      id: report.id,
      tenantId: this.tenantId
    });

    if (response.status == 200) {
      return response.body;
    } else {
      await this.logout();
    }
  }

  async postDailyCheckup(anxiety, fatigue, stress) {
    let response = await this.post("/api/DailyRating", {
      timeStamp: new Date().toISOString(),
      anxiety: anxiety,
      fatigue: fatigue,
      stress: stress
    });

    if (response.status == 200) {
      return response.body;
    } else {
      await this.logout();
    }

  }

  async logout() {
    await this.loadingService.dismissLoading();
    await this.storage.clearStorage();
    await this.resetData();
    await this.router.navigateByUrl("/login", {
      replaceUrl: true
    });
  }

  async resetData() {
    this.accessToken = null;
    this.refreshToken = null;
    this.email = "";
    this.tenantId = "";
    this.user = <any>{};
    this.userSicknessData = <any>{};
  }
}
