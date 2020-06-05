import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import {
  CourseService,
  AuthService,
  CourseBatchesRequest,
  CourseBatchStatus,
  CourseEnrollmentType,
  EnrollCourseRequest
} from 'sunbird';
import {
  IonicPage,
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
import * as _ from 'lodash';
import {
  ProfileConstants,
  EventTopics
} from '../../app/app.constant';
import { CommonUtilService } from '../../service/common-util.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@app/config/appConfig';

/**
 * Generated class for the CourseBatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-course-batches',
  templateUrl: 'course-batches.html',
})
export class CourseBatchesPage implements OnInit {

  /**
   * Contains user id
   */
  userId: string;

  /**
   * To hold course indentifier
   */
  identifier: string;

  /**
   * Loader
   */
  showLoader: boolean;

  /**
   * Contains upcomming batches list
   */
  upcommingBatches: Array<any> = [];

  /**
   * Contains ongoing batches list
   */
  ongoingBatches: Array<any> = [];

  /**
   * Flag to check guest user
   */
  isGuestUser = false;

  /**
   * Contains batches list
   */
  public batches: Array<any>;

  /**
   * Selected filter
   */
  selectedFilter: string;

  /**
   * Default method of class CourseBatchesComponent
   *
   * @param {CourseService} courseService To get batches list
   * @param {NavController} navCtrl To redirect form one page to another
   * @param {NavParams} navParams To get url params
   * @param {NgZone} zone To bind data
   * @param {AuthService} authService To get logged-in user data
   */
  constructor(
    private courseService: CourseService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private authService: AuthService,
    private commonUtilService: CommonUtilService,
    private events: Events,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getUserId();
  }

  /**
   * Enroll logged-user into selected batch
   *
   * @param {any} item contains details of select batch
   */
  enrollIntoBatch(item: any): void {
    const enrollCourseRequest: EnrollCourseRequest = {
      userId: this.userId,
      courseId: item.courseId,
      contentId: item.courseId,
      batchId: item.id,
      batchStatus: item.status
    };
    this.courseService.enrollCourse(enrollCourseRequest)
      .then((data: any) => {
        data = JSON.parse(data);
        this.zone.run(() => {
          this.sync(enrollCourseRequest);
          this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_ENROLLED'));
          this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
            batchId: item.id,
            courseId: item.courseId
          });
          this.navCtrl.pop();
        });
      })
      .catch((error: any) => {
        this.zone.run(() => {
          error = JSON.parse(error);
          if (error && error.error === 'CONNECTION_ERROR') {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_NO_INTERNET_MESSAGE'));
          } else if (error && error.error === 'USER_ALREADY_ENROLLED_COURSE') {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('ALREADY_ENROLLED_COURSE'));
          }
        });
      });
  }

  /**
 * 
 * call kendra sync api
 */

  sync(obj) {
    const payload = {
      batchId: obj.batchId,
      userIds: [obj.userId],
      courseId: obj.courseId
    }
    const url = AppConfig.apiBaseUrl + AppConfig.baseUrls.kendraUrl + AppConfig.apiConstants.sync;
    this.http.post(url, payload).subscribe(success => {

    }, error => {

    })
  }

  /**
   * Get logged-user id. User id is needed to enroll user into batch.
   */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null || session === 'null') {
        this.zone.run(() => { this.isGuestUser = true; });
      } else {
        this.zone.run(() => {
          const sessionObj = JSON.parse(session);
          this.isGuestUser = false;
          this.userId = sessionObj[ProfileConstants.USER_TOKEN];
          this.getBatchesByCourseId();
        });
      }
    });
  }

  /**
   * To get batches, passed from enrolled-course-details page via navParams
   */
  getBatchesByCourseId(): void {
    this.ongoingBatches = this.navParams.get('ongoingBatches');
    this.upcommingBatches = this.navParams.get('upcommingBatches');
  }

  spinner(flag) {
    this.zone.run(() => {
      this.showLoader = false;
    });
  }
}
