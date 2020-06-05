import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  Platform,
  Navbar
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {
  TabsPage,
  SharedPreferences,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  ImpressionType,
  ContainerService,
  Profile,
  UserSource,
  ProfileType,
  ProfileService
} from 'sunbird';
import { Map, initTabs, GUEST_TEACHER_TABS, GUEST_STUDENT_TABS, PreferenceKey } from '@app/app';
import { AppGlobalService, TelemetryGeneratorService, CommonUtilService } from '@app/service';
import { SunbirdQRScanner } from '@app/pages/qrscanner';
import { ProfileSettingsPage } from '@app/pages/profile-settings/profile-settings';
import { LanguageSettingsPage } from '@app/pages/language-settings/language-settings';

const selectedCardBorderColor = '#006DE5';
const borderColor = '#F7F7F7';

@IonicPage()
@Component({
  selector: 'page-user-type-selection',
  templateUrl: 'user-type-selection.html',
})

export class UserTypeSelectionPage {
  @ViewChild(Navbar) navBar: Navbar;
  teacherCardBorderColor = '#F7F7F7';
  studentCardBorderColor = '#F7F7F7';
  smcCardBorderColor='#F7F7F7';
  eoCardBorderColor='#F7F7F7';
  slCardBorderColor='#F7F7F7';
  othrCardBorderColor='#F7F7F7';
  userTypeSelected = false;
  selectedUserType: ProfileType;
  continueAs = '';
  profile: Profile;
  backButtonFunc = undefined;

  /**
   * Contains paths to icons
   */
  studentImageUri = 'assets/imgs/ic_student.png';
  teacherImageUri = 'assets/imgs/ic_teacher.png';
  isChangeRoleRequest = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
    private preference: SharedPreferences,
    private profileService: ProfileService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private container: ContainerService,
    private zone: NgZone,
    private event: Events,
    private commonUtilService: CommonUtilService,
    private appGlobalService: AppGlobalService,
    private scannerService: SunbirdQRScanner,
    private platform: Platform
  ) { }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.USER_TYPE_SELECTION, Environment.HOME, true);
      this.handleBackButton();
    };
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.USER_TYPE_SELECTION,
      Environment.HOME, '', '', '');

    this.event.subscribe('event:showScanner', (data) => {
      if (data.pageName === PageId.USER_TYPE_SELECTION) {
        this.scannerService.startScanner(PageId.USER_TYPE_SELECTION, true);
      }
    });
  }

  ionViewWillEnter() {
    this.profile = this.appGlobalService.getCurrentUser();
    this.isChangeRoleRequest = Boolean(this.navParams.get('isChangeRoleRequest'));
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.USER_TYPE_SELECTION, Environment.HOME, false);
      this.handleBackButton();
      this.backButtonFunc();
    }, 10);
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }
  }

  handleBackButton() {
    if (this.isChangeRoleRequest) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(LanguageSettingsPage);
    }
  }

  selectTeacherCard() {
    this.selectCard('USER_TYPE_1', ProfileType.TEACHER);
  }

  selectStudentCard() {
    this.selectCard('USER_TYPE_2', ProfileType.STUDENT);
  }
  selectSMCCard(){
    this.selectCard('USER_TYPE_SMC',ProfileType.TEACHER);
  }
  selectEOCard(){
    this.selectCard('USER_TYPE_EO', ProfileType.TEACHER);
  }
  selectSLCard(){
    this.selectCard('USER_TYPE_SL', ProfileType.TEACHER);
  }
  selectOtherCard(){
    this.selectCard('USER_TYPE_Other', ProfileType.TEACHER);
  }
  selectCard(userType, profileType) {
    this.zone.run(() => {
      this.userTypeSelected = true;
      this.teacherCardBorderColor = (userType === 'USER_TYPE_1') ? selectedCardBorderColor : borderColor;
      this.studentCardBorderColor = (userType === 'USER_TYPE_1') ? borderColor : selectedCardBorderColor;
      this.smcCardBorderColor = (userType === 'USER_TYPE_SMC') ? selectedCardBorderColor : borderColor;
      this.slCardBorderColor = (userType === 'USER_TYPE_SL') ? selectedCardBorderColor : borderColor;
      this.eoCardBorderColor = (userType === 'USER_TYPE_EO') ? selectedCardBorderColor : borderColor;
      this.othrCardBorderColor= (userType === 'USER_TYPE_Other') ? selectedCardBorderColor : borderColor;
      this.selectedUserType = profileType;
      this.continueAs = this.commonUtilService.translateMessage(
        'CONTINUE_AS_ROLE',
        this.commonUtilService.translateMessage(userType)
      );

      if (!this.isChangeRoleRequest) {
        this.preference.putString(PreferenceKey.SELECTED_USER_TYPE, this.selectedUserType);
      }
    });
  }

  continue() {
    this.generateInteractEvent(this.selectedUserType);

    // When user is changing the role via the Guest Profile screen
    if (this.profile !== undefined && this.profile.handle) {
      // if role types are same
      if (this.profile.profileType === this.selectedUserType) {
        this.gotoTabsPage();
      } else {
        this.gotoTabsPage(true);
      }
    } else {
      const profileRequest = new Profile();
      profileRequest.handle = 'Guest1';
      profileRequest.profileType = this.selectedUserType;
      profileRequest.source = UserSource.LOCAL;
      this.setProfile(profileRequest);
    }
  }

  updateProfile(updateRequest: Profile) {
    this.profileService.updateProfile(updateRequest)
      .then(() => {
        this.gotoTabsPage(true);
      })
      .catch((err: any) => {
        console.error('Err', err);
      });
  }

  // TODO Remove getCurrentUser as setCurrentProfile is returning uid
  setProfile(profileRequest: Profile) {
    this.profileService.setCurrentProfile(true, profileRequest).then(() => {
      this.profileService.getCurrentUser().then((success: any) => {
        const userId = JSON.parse(success).uid;
        this.event.publish(AppGlobalService.USER_INFO_UPDATED);
        if (userId !== 'null') {
          this.preference.putString('GUEST_USER_ID_BEFORE_LOGIN', userId);
        }
        this.profile = JSON.parse(success);
        this.gotoTabsPage();
      }).catch(error => {
        console.error('Error', error);
        return 'null';
      });
    })
      .catch(err => {
        console.error('Error', err);
      });
  }

  /**
   * It will initializes tabs based on the user type and navigates to respective page
   * @param {boolean} isUserTypeChanged
   */
  gotoTabsPage(isUserTypeChanged: boolean = false) {
    // Update the Global variable in the AppGlobalService
    this.event.publish(AppGlobalService.USER_INFO_UPDATED);

    if (this.selectedUserType === ProfileType.TEACHER) {
      initTabs(this.container, GUEST_TEACHER_TABS);
    } else if (this.selectedUserType === ProfileType.STUDENT) {
      initTabs(this.container, GUEST_STUDENT_TABS);
    }
    if (this.isChangeRoleRequest && isUserTypeChanged) {
      if (this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
        this.container.removeAllTabs();
        this.navCtrl.push(ProfileSettingsPage, { isChangeRoleRequest: true, selectedUserType: this.selectedUserType });
      } else {
        this.profile.profileType = this.selectedUserType;
        this.profileService.updateProfile(this.profile)
          .then((res: any) => {
            this.navCtrl.push(TabsPage, {
              loginMode: 'guest'
            });
          }).catch(error => {
            console.error('Error=');
          });
        // this.navCtrl.setRoot(TabsPage);
      }
    } else if (this.appGlobalService.isProfileSettingsCompleted) {
      this.navCtrl.push(TabsPage, {
        loginMode: 'guest'
      });
    } else if (this.appGlobalService.DISPLAY_ONBOARDING_SCAN_PAGE) {
      // Need to go tabspage when scan page is ON, changeRoleRequest ON and profileSetting is OFF
      if (this.isChangeRoleRequest) {
        this.navCtrl.push(TabsPage, {
          loginMode: 'guest'
        });
      } else {
        this.scannerService.startScanner(PageId.USER_TYPE_SELECTION, true);
      }
    } else if (this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
      this.navCtrl.push(ProfileSettingsPage);
    } else {
      this.profile.profileType = this.selectedUserType;
      this.profileService.updateProfile(this.profile)
        .then((res: any) => {
          this.navCtrl.push(TabsPage, {
            loginMode: 'guest'
          });
        }).catch(error => {
          console.error('Error=', error);
        });
    }
  }

  generateInteractEvent(userType) {
    const values = new Map();
    values['UserType'] = userType;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CONTINUE_CLICKED,
      Environment.HOME,
      PageId.USER_TYPE_SELECTION,
      undefined,
      values);
  }
}