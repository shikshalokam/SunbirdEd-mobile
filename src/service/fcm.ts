// import { Injectable } from '@angular/core';
// import { Platform } from 'ionic-angular';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';
// import { HTTP } from '@ionic-native/http/ngx';
// import { AppGlobalService } from './app-global.service';

// @Injectable()
// export class FcmProvider {

//   fcmDeviceId: string;


//   constructor(
//     private fcm: FCM,
//     private localNotification: LocalNotifications,
//     private http: HTTP,
//     private globalService: AppGlobalService,
//     private platform: Platform) {
//     console.log('Hello FcmProvider Provider');
//   }

//   initializeFCM() {
//     if (this.platform.is('android')) {
//       this.initializeFirebaseAndroid()
//     } else {
//       this.initializeFirebaseIOS()
//     }
//   }

//   async initializeFirebaseAndroid() {
//     this.subscribeToPushNotifications();
//     this.localNotificationClickHandler();
//     this.fcm.getToken().then(token => {
//       this.fcmDeviceId = token;
//     }).catch(error => {
//     });


//     this.fcm.onTokenRefresh().subscribe(token => {
//       this.fcmDeviceId = token;
//       this.registerDeviceID();
//     })
//   }

//   subscribeToPushNotifications() {
//     this.fcm.onNotification().subscribe(notificationData => {
//       //Will be triggered if the user clicks on the notification and come to the app
//       if (notificationData.wasTapped) {
//         this.notificationClickActions(notificationData);
//       } else {
//         //Will be triggered if the user is using the app(foreground);
//         this.triggerLocalNotification(notificationData);
//       };
//     }, error => {
//       console.log("Error of subscribeTo Push notification");
//     });
//   }


//   localNotificationClickHandler() {
//     this.localNotification.on('click').subscribe(success => {
//       this.notificationClickActions(success.data);
//     })
//   }

//   triggerLocalNotification(notificationData) {
//     const obj = {
//       title: notificationData.title,
//       text: notificationData.text,
//       foreground: true,
//       priority: 2,
//       id: notificationData.id,
//       data: notificationData,
//       // color: AppConfigs.primary_color,
//       icon: "notification_icon"
//     }
//     this.localNotification.schedule(obj);
//   }

//   registerDeviceID(token?: string) {
//     const url = 'https://devhome.shikshalokam.org/assessment-service/api/v1/notifications/push/registerDevice';
//     const payload = {
//       deviceId: this.fcmDeviceId
//     }
//     const httpHeaders = {
//       'x-authenticated-user-token': this.globalService.getUserId(),
//       'app': "bodh",
//       'os': this.platform.is('android') ? 'android' : 'ios'
//     };
//     alert(JSON.stringify(httpHeaders));
//     this.http.post(url, payload, httpHeaders).then(success => {
//       alert("success");
//       alert(JSON.stringify(success))
//       //   console.log("==========================================================================")
//       //   console.log("Successfully registered token");
//       //   console.log("==========================================================================")
//     }).catch(error => {
//       alert("error");
//       alert(JSON.stringify(error))

//       //   console.log("Error while registering token");

//     })
//     // this.http.post(url, payload, httpOptions).subscribe(success => {
//     //   console.log("==========================================================================")
//     //   console.log("Successfully registered token");
//     //   console.log("==========================================================================")
//     // }, error => {
//     //   console.log("Error while registering token");
//     // })
//   }

//   initializeFirebaseIOS() {

//   }

//   // subscribeToChannels(topic: string) {
//   //   this.fcm.subscribeToTopic(topic).then(success => {
//   //     this.subscribeToPushNotifications();
//   //   }).catch(error => { })
//   // }

//   notificationClickActions(notificationMeta) {
//     notificationMeta.payload = JSON.parse(notificationMeta.payload)
//     // switch (notificationMeta.action) {
//     //   case 'mapping':
//     //     this.notificationProvider.getMappedAssessment(notificationMeta)
//     //     break
//     //   case 'viewOnly':
//     //   case 'view_only':
//     //     break
//     //   case 'Pending':
//     //   case 'pending':
//     //     this.notificationProvider.goToDetails(notificationMeta);
//     //     break
//     // }
//     // this.notificationProvider.markAsRead(notificationMeta.id);
//   }



// }
