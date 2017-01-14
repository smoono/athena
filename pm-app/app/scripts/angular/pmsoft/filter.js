/**
 * Created by FanTaSyLin on 2016/9/29.
 */

(function () {

    'use strict';

    var app = angular.module('PMSoft');
    app.filter('to_trusted', toTrusted);
    /**
     * 移除掉未审核记录数量为0的项目（审核页面左侧列表）
     */
    app.filter('rm_project_unaudited_count0', rmProjectByCount0);

    /**
     * 当未审核记录数量大于100时 显示100+
     */
    app.filter('add_plus_count_lsg100', add_plus_count_lsg100);

    toTrusted.$inject = ['$sce'];

    function toTrusted($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }
    
    function rmProjectByCount0() {
        return function (items) {
            var array = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].count !== 0) {
                    array.push(items[i]);
                }
            }
            return array;
        }
    }

    function add_plus_count_lsg100() {
        return function (item) {
            if (item > 100) {
                return "100" + "+";
            } else {
                return item.toString();
            }
        }
    }

})();