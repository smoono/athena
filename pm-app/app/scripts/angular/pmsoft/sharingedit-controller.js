/**
 * Created by FanTaSyLin on 2017/2/14.
 */


(function () {

    "use strict";

    angular.module("PMSoft")
        .controller("SharingController", SharingControllerFn);

    SharingControllerFn.$inject = ["$cookies", "PMSoftServices"];

    function SharingControllerFn($cookies, PMSoftServices) {

        var self = this;
        var sharingEditModal = angular.element(document.getElementById('sharingEdit'));
        var summernote = angular.element(document.getElementById('sharing-summernote'));
        var pastProjects = [];
        var operateType = "";

        sharingEditModal.on("show.bs.modal", dataInit);

        /**
         * @type {TargetItem}
         */
        self.currentTargetItem = PMSoftServices.sharingTarget;

        /**
         * @type {TargetItem[]}
         */
        self.targetItems = PMSoftServices.sharingTargets;

        self.sharingTitle = "";

        /**
         * 控制分享地址是否能够选择
         */
        self.allowSelectTarget = false;

        /**
         * 选择目的地址
         */
        self.selectTargetItem = _selectTargetItem;

        /**
         * 发布分享
         */
        self.submitSharing = _submitSharing;

        function _submitSharing() {
            var body = {};
            body.authorID = $cookies.get("account");
            body.authorName = $cookies.get("name");
            body.title = self.sharingTitle;
            body.content = summernote.summernote('code');
            body.attachments = [];
            body.tags = [];
            body.ranges = [{
                type: self.currentTargetItem.type,
                param: [self.currentTargetItem.param]
            }];

            if (operateType === "Create") {
                PMSoftServices.submitSharing(body, function (res) {
                    sharingEditModal.modal('hide');
                    if (PMSoftServices.onNewSharingSubmited !== undefined && typeof PMSoftServices.onNewSharingSubmited === "function") {
                        PMSoftServices.onNewSharingSubmited();
                    }
                }, function (res) {
                    alert("提交失败。请检查网络！");
                });
            } else if (operateType === "Edit") {
                body._id = PMSoftServices.currentSharingDetail._id;
                PMSoftServices.editSharing(body, function (res) {
                    sharingEditModal.modal('hide');
                    if (PMSoftServices.onSharingEdited !== undefined && typeof PMSoftServices.onSharingEdited === "function") {
                        PMSoftServices.onSharingEdited(body);
                    }
                }, function (res) {
                    alert("提交失败。请检查网络！");
                });
            }
        }

        function _selectTargetItem(item) {
            self.currentTargetItem = item;
        }

        function dataInit() {

            _initSummernote();

            if (PMSoftServices.currentSharingDetail) {
                self.currentTargetItem = PMSoftServices.currentSharingDetail.targetItem;
                self.allowSelectTarget = false;
                self.sharingTitle = PMSoftServices.currentSharingDetail.title;
                summernote.summernote("code", PMSoftServices.currentSharingDetail.content);
                operateType = "Edit";
            } else {
                self.allowSelectTarget = true;
                self.sharingTitle = "";
                summernote.summernote("code", "");
                operateType = "Create";
            }

        }

        /**
         * 初始化Summernote
         */
        function _initSummernote() {
            summernote.summernote({
                minHeight: 700,
                maxHeight: 700,
                toolbar: [
                    // [groupName, [list of button]]
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['insert', ['picture', 'link', 'table', 'hr']]
                ]

            });
        }
    }

    /**
     * @description 目标地址对象
     * @typedef {TargetItem} 
     * @property {string} param
     * @property {string} name
     * @property {string} type
     */

})();