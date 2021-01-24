import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  baseUrl = environment.baseURL;
  constructor(public http: HttpClient) {}

  postData = (url, data) => {
    return this.http.post(`${this.baseUrl}${url}`, data);
  };

  getData = (url, params = {}) => {
    return this.http.get(`${this.baseUrl}${url}`, params)
  }
}
