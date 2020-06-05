
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnnouncementService, AttachmentService, TelemetryService, AnnouncementStatus } from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';

@Component({
    selector: 'announcement-detail',
    templateUrl: 'announcement-detail.html',
    providers: [TelemetryService, AnnouncementService]
})
/**
 * Generated class for the AnnouncementDetailComponent component.
 *
 */
export class AnnouncementDetailComponent implements OnInit {
    /**
     * Contains announcemet  details
     */
    announcementDetail: any;
    showChildrenLoader: boolean;

    /**
     * Contains reference of Anoouncement service service
     */
    public announcementService: AnnouncementService;

    /**
     * Contains the announcement id
     */
    public announcementId: string;

    /**
     * Contains reference of Attachment service
     */
    public attachmentService: AttachmentService;

    /**
     * Contains reference of File
     */
    public file: File;


    /**
     * Contains ref of navigation controller
     */
    public navCtrl: NavController;

    /**
     * Contains ref of navigation params
     */
    public navParams: NavParams;

    public isAttachment = true;

    /**
     * Contains the progress of the attachment downloading
     */
    public progress = 0;

    /**
     * Visibility of the progress bar
     *
     */
    public showProgressBar = false;

    /**
     *
     * Contains reference of zone service
     */
    public zone: NgZone;
    /**
     *
     * @param navCtrl
     * @param navParams
     * @param contentService
     */
    constructor(navCtrl: NavController, private socialSharing: SocialSharing,
        navParams: NavParams, announcementService: AnnouncementService,
        attachmentService: AttachmentService,
        file: File,
        zone: NgZone) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.announcementService = announcementService;
        this.zone = zone;
        this.announcementId = this.navParams.get('id');
    }
    /**
     * To get Announcement  details.
     */
    getAnnouncementDetails() {
        const req = {
            announcementId: this.navParams.get('id')
        };

        this.announcementService.getAnnouncementDetails(req).then((data: any) => {
            this.zone.run(() => {
                data = JSON.parse(data);
                this.announcementDetail = data ? data : [];
            });

            if (this.announcementDetail !== null) {
                if (!this.announcementDetail.read) {
                    this.updateAnnouncementReadStatus();
                }
            }
        })
            .catch((error) => {
            });
    }

    updateAnnouncementReadStatus() {
        const req = {
            announcementId: this.navParams.get('id'),
            announcementStatus: AnnouncementStatus.READ
        };

        this.announcementService.updateAnnouncementState(req,
            (success: any) => {
            }, (error: any) => {
            });
    }

    /**
     * Angular life cycle hooks
     */
    ngOnInit() {
        this.getAnnouncementDetails();
    }
    /**
     * SocialSharing
     */
    share(announcementDetail) {
        const message = ` Type: ${announcementDetail.type}\nDescription: ${announcementDetail.description}\nTitle:
         ${announcementDetail.title}\n Links:  ${announcementDetail.links}`;
        const attachmentPath: string = this.file.externalRootDirectory + 'Announcements/' + announcementDetail.id +
         '/' + announcementDetail.attachments[0].name;
        this.socialSharing.share(message, null, attachmentPath, null).then(() => {
        }).catch((error) => {
        });
    }

    /**
   *  Returns the Object with given Keys only
   * @param {string} keys - Keys of the object which are required in new sub object
   * @param {object} obj - Actual object
   * @returns {object}
   */
    getSubset(keys, obj) {
        return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
    }

    openLink(url: string): void {
        const options = 'hardwareback=yes,clearcache=no,zoom=no,toolbar=yes,clearsessioncache=no,' +
        'closebuttoncaption=Done,disallowoverscroll=yes';
        (<any>window).cordova.InAppBrowser.open(url, '_system', options);
    }

    /**
     * Method to download attachment
     *
     *
     * @param attachmentsLink
     */
    downloadattachment(attachmentsLink) {
        const url = attachmentsLink;
        const fileUrl = url.split('/');
        const attachmentFileName = fileUrl[fileUrl.length - 1];
        const announcementPath = this.file.externalRootDirectory + '/Announcements/';
        const attachmentPath = this.file.externalRootDirectory + '/Announcements/' + this.announcementId + '/';

        // Check if the  announcement directory exists
        this.file.checkDir(this.file.externalRootDirectory, 'Announcements').then(
            (found) => {
                if (found) {
                    this.checkAnnouncementIdDirectory(url, announcementPath, attachmentPath, attachmentFileName);
                }
            }
        ).catch(
            (error) => {
                this.file.createDir(this.file.externalRootDirectory, 'Announcements', true).then(
                    (value) => {

                        this.checkAnnouncementIdDirectory(url, announcementPath, attachmentPath, attachmentFileName);
                    }
                ).catch(
                    (err) => {
                    }
                );
            }
        );
    }

    /**
     * This method checks if the announcement id directory already exists, if not, it will create one
     *
     * @param url
     * @param announcementPath
     * @param attachmentPath
     * @param attachmentFileName
     */
    checkAnnouncementIdDirectory(url, announcementPath, attachmentPath, attachmentFileName) {
        // Check if the  announcement id directory exists
        this.file.checkDir(announcementPath, this.announcementId).then(
            (found) => {
                if (found) {
                    this.downloadAndSaveFile(url, attachmentPath, attachmentFileName);
                }
            }
        ).catch(
            (error) => {
                this.file.createDir(announcementPath, this.announcementId, true).then(
                    (value) => {
                        this.downloadAndSaveFile(url, attachmentPath, attachmentFileName);

                    }
                ).catch(
                    (err) => {
                    });
            }
        );
    }

    /**
     * This method downloads and saves a file to the specified directory
     *
     * @param url
     * @param attachmentPath
     * @param attachmentFileName
     */
    downloadAndSaveFile(url, attachmentPath, attachmentFileName) {
        // check if the attachment is already downloaded and stored locally
        this.file.checkFile(attachmentPath, attachmentFileName).then(
            (found) => {
                if (found) {
                    const path: string = attachmentPath + attachmentFileName;
                    this.attachmentService.checkExtensionAndOpenFile(path);
                } else {
                    this.showProgressBar = true;

                    this.attachmentService.downloadAttachment(url, attachmentPath + attachmentFileName);

                    this.attachmentService.listenDownloadProgress((event) => {
                        this.progress = ((event.loaded) / (event.total)) * 100;
                    });
                }
            }
        ).catch(
            (err) => {
                this.showProgressBar = true;

                this.attachmentService.downloadAttachment(url, attachmentPath + attachmentFileName);

                this.attachmentService.listenDownloadProgress((event) => {
                    this.progress = ((event.loaded) / (event.total)) * 100;
                });
            }
        );
    }
}
