import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

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

  constructor(public http: HttpClient, private storage: StorageService, public router: Router) { }

  async post(endpoint, data) {
    let url = this.base + endpoint;
    let headers = {};
    let access = await this.getAccessToken();

    if (access == null)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + this.accessToken, "TenantId": this.tenantId };
    let config = {
      url: url,
      method: "POST",
      headers: headers
    }
    try {
      return await this.http.post(url, data, config).toPromise();
    } catch (e) {
      return e;
    }
  }

  async put(endpoint, data) {
    let url = this.base + endpoint;
    let headers = {};
    let access = await this.getAccessToken();
    if (access == null)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + this.accessToken, "TenantId": this.tenantId };
    let config = {
      url: url,
      method: "PUT",
      headers: headers
    }
    try {
      return await this.http.put(url, data, config).toPromise();
    } catch (e) {
      return e;
    }
  }

  async get(endpoint, data) {
    let url = this.base + endpoint;
    let headers = {};
    if (this.accessToken == null)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + this.accessToken, "TenantId": this.tenantId };

    try {
      return await this.http.get(url, {
        headers: headers,
        params: data
      }).toPromise();
    } catch (e) {
      return e;
    }
  }
  async delete(endpoint) {
    let url = this.base + endpoint;
    let headers = {};
    let access = await this.getAccessToken();
    if (access == null)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + this.accessToken, "TenantId": this.tenantId };

    try {
      return await this.http.delete(url, {
        headers: headers
      }).toPromise();
    } catch (e) {
      return e;
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
    if (this.accessToken == null)
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json" };
    else
      headers = { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', "Accept": "application/json", "Authorization": "Bearer " + this.accessToken, "TenantId": this.tenantId };
    let config = {
      url: this.base + "/auth/Auth/Tokens",
      method: "POST",
      headers: headers
    }
    let token = await this.getRefreshToken();
    let accessToken = await this.getAccessToken();

    try {
      return await this.http.post(this.base + "/auth/Auth/Tokens", {
        email: this.email,
        accessToken: accessToken,
        refreshToken: token,
        tenantId: this.tenantId
      }, config).toPromise();
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
    console.log(response);
    if (response.status == undefined) {
      this.user = response;
    } else {
      response = await this.refreshTokens();

      if (response.status == undefined) {
        await this.setAccessToken(response.accessToken);
        await this.setRefreshToken(response.refreshToken);

        this.email = response.email;
        this.tenantId = response.tenantId;

        response = await this.get("/api/Account/GetUserInfo", { tenantId: this.tenantId });

        if (response.status != undefined) {
          // logout
          await this.logout();
        } else {
          //set data
          this.user = response;
        }
      } else {
        // logout
        await this.logout();
      }
    }

  }

  async loadSicknessData() {
    let response = await this.get("/api/Sickness", {});

    if (response.status == undefined) {
      this.userSicknessData = response;
    } else if (response.status == 401) {
      response = await this.refreshTokens();

      if (response.status == undefined) {
        await this.setAccessToken(response.accessToken);
        await this.setRefreshToken(response.refreshToken);

        this.email = response.email;
        this.tenantId = response.tenantId;

        response = await this.http.get("/api/Sickness", {});

        if (response.status != undefined) {
          // logout
          await this.logout();
        } else {
          //set data
          this.userSicknessData = response;
        }
      } else {
        // log out
        await this.logout();
      }
    } else {
      await this.logout();
    }
  }

  async loadUserDefaults() {
    let response = await this.get("/api/Account/UserDefaults", {});

    if (response.status == undefined) {
      this.userDefaults = response;
    } else if (response.status == 401) {
      response = await this.refreshTokens();

      if (response.status == undefined) {
        await this.setAccessToken(response.accessToken);
        await this.setRefreshToken(response.refreshToken);

        this.email = response.email;
        this.tenantId = response.tenantId;

        response = await this.http.get("/api/Account/UserDefaults", {});

        if (response.status != undefined) {
          // logout
          await this.logout();
        } else {
          //set data
          this.userDefaults = response;
        }
      } else {
        // log out
        await this.logout();
      }
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

    console.log(day);
    let response = await this.get("/sickscan/Data", {
      dateOffset: day.getTime(),
      minLon: minLon,
      maxLon: maxLon,
      minLat: minLat,
      maxLat: maxLat
    });

    if (response.status == undefined) {
      return response;
    } else if (response.status == 401) {
      response = await this.refreshTokens();

      if (response.status == undefined) {
        await this.setAccessToken(response.accessToken);
        await this.setRefreshToken(response.refreshToken);

        response = await this.get("/sickscan/Data", {
          dateOffset: day.getTime(),
          minLon: minLon,
          maxLon: maxLon,
          minLat: minLat,
          maxLat: maxLat
        });
        if (response.status != undefined) {
          // logout
          await this.logout();
        } else {
          //set data
          return response;
        }
      } else {
        // log out
        await this.logout();
      }
    } else {
      await this.logout();
    }

    console.log(response);
  }

  async getSicknessDetails(report) {
    let response = await this.get("/api/Sickness/Details", {
      id: report.id,
      tenantId: this.tenantId
    });

    if (response.status == undefined) {
      return response;
    } else if (response.status == 401) {
      response = await this.refreshTokens();

      if (response.status == undefined) {
        await this.setAccessToken(response.accessToken);
        await this.setRefreshToken(response.refreshToken);

        this.email = response.email;
        this.tenantId = response.tenantId;

        response = await this.get("/api/Sickness/Details", {
          id: report.id,
          tenantId: this.tenantId
        });

        if (response.status != undefined) {
          // logout
          await this.logout();
        } else {
          //set data
          return response;
        }
      } else {
        // log out
        await this.logout();
      }
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

    if (!response) {
      response = await this.refreshTokens();
      if (response.status == undefined) {
        await this.setAccessToken(response.accessToken);
        await this.setRefreshToken(response.refreshToken);
        this.email = response.email;
        this.tenantId = response.tenantId;

        response = await this.post("/api/DailyRating", {
          timeStamp: new Date().toISOString(),
          anxiety: anxiety,
          fatigue: fatigue,
          stress: stress
        });

        return response;
      } else {
        await this.logout();
      }
    } else
      return response;
  }

  async logout() {
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
