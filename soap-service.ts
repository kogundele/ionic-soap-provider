import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';

import xml2js from 'xml2js';

/*
  Generated class for the HttpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let testBaseURL = "YOUR SOAP API ENDPOINT URL GOES HERE";

@Injectable()
export class HttpServiceProvider {

  loading;
  networkType: string = "";
  networkStatusOnline: boolean = true;

  constructor(public http: HttpClient, public loadingCtrl: LoadingController, public network: Network, public toastCtrl: ToastController) {
    console.log('Hello HttpServiceProvider Provider');
    if(this.networkType == "unknown" || this.networkType == "none" || this.networkType == undefined) {
      this.displayNetworkStatus('Your internet connection appears to be offline !!!');
      this.networkStatusOnline = false;
    } else {
      this.displayNetworkStatus('You have an active internet connection');
      this.networkStatusOnline = true;
    }
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
  }

  public makeGetSoapRequest(url, param) {
  	if (this.networkStatusOnline) {
      return new Promise((resolve, reject) => {
	        let xhr = new XMLHttpRequest();
	        xhr.open('GET', testBaseURL, true);
	        xhr.setRequestHeader('Content-Type', 'text/xml');
          xhr.setRequestHeader("SOAPAction", url); //optional
          xhr.responseType = "text";
	        xhr.onload = () => {
	            this.hideSpinner();
	            if (xhr.status >= 200 && xhr.status < 300) {
	                resolve(this.convertXmltoJson(xhr.responseText));
	            } else {
	                reject(xhr.statusText);
	            }
	        };
	        xhr.onerror = () => { 
	          this.hideSpinner();
	        	reject(xhr.statusText)
	        };
	        xhr.send(param);
	    });
    } else {
      this.displayNetworkStatus('Your internet connection appears to be offline !!!');
	    return null;
    }
  }

  public makePostSoapRequest(url, param) {
  	if (this.networkStatusOnline) {
      return new Promise((resolve, reject) => {
	        let xhr = new XMLHttpRequest();
	        xhr.open('POST', testBaseURL, true);
	        xhr.setRequestHeader('Content-Type', 'text/xml');
          xhr.setRequestHeader("SOAPAction", url); //optional
          xhr.responseType = "text";
	        xhr.onload = () => {
	            this.hideSpinner();
	            if (xhr.status >= 200 && xhr.status < 300) {
	                resolve(this.convertXmltoJson(xhr.responseText));
	            } else {
	                reject(xhr.statusText);
	            }
	        };
	        xhr.onerror = () => { 
	          this.hideSpinner();
	        	reject(xhr.statusText)
	        };
	        xhr.send(param);
	    });
    } else {
      this.displayNetworkStatus('Your internet connection appears to be offline !!!');
	    return null;
    }
  }

  public showSpinner() {
    this.loading.present();
  }

  public hideSpinner() {
  	this.loading.dismiss();
  }

  public displayNetworkStatus(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  public convertXmltoJson (data) {
    xml2js.parseString(data, { explicitArray: false }, (error, result) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log(result);
        return result;
      }
    });
  }

}
