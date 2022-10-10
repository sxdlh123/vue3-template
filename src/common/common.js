import headQuery from "@/store/head-query";
const query = headQuery();
(function (window, document) {
  function createHttpRequest() {
    if (window.ActiveXObject) {
      // eslint-disable-next-line no-undef
      return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
  }
  function AliLogTracker(host, project, logstore) {
    this.uri_ =
      "//" +
      project +
      "." +
      host +
      "/logstores/" +
      logstore +
      "/track?APIVersion=0.6.0";
    this.params_ = new Array();
    this.httpRequest_ = createHttpRequest();
  }
  AliLogTracker.prototype = {
    push: function (key, value) {
      //   if(!key || !value) {
      //       return;
      //   }
      this.params_.push(key);
      this.params_.push(value);
    },
    logger: function () {
      var url = this.uri_;
      var k = 0;
      while (this.params_.length > 0) {
        if (k % 2 == 0) {
          url += "&" + encodeURIComponent(this.params_.shift());
        } else {
          url += "=" + encodeURIComponent(this.params_.shift());
        }
        ++k;
      }
      try {
        this.httpRequest_.open("GET", url, true);
        this.httpRequest_.send(null);
      } catch (ex) {
        if (
          window &&
          window.console &&
          typeof window.console.log === "function"
        ) {
          console.log(
            "Failed to log to ali log service because of this exception:\n" + ex
          );
          console.log("Failed log data:", url);
        }
      }
    },
  };
  window.Tracker = AliLogTracker;
})(window, document);
var $ = require("jquery");
let { FingerprintJS } = require("@/common/fp.min");
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
const SM4 = require("gm-crypt").sm4;
function sm4(params) {
  let sm4Config = {
    key: "kmrbzscckbitjszx",
    mode: "ecb",
    cipherType: "base64", // default is base64
  };
  return new SM4(sm4Config);
}
let app_id = "";

function getUrl() {
  return new Promise((res, rej) => {
    const _time = setInterval(() => {
      if (query.urlKey.length > 0) {
        window.clearInterval(_time);
        res("ok");
      }
    }, 300);
  });
}
getUrl().then(() => {
  console.log(query.urlKey, "参数");
  let siteKeyStr = JSON.parse(query.urlKey);
  if (siteKeyStr) {
    let siteInfoArr = sm4().decrypt(siteKeyStr);
    app_id = JSON.parse(siteInfoArr)[0].app_id;
    let configData = {
      _app_id: app_id,
      _pro_id: 1,
      _event_type: "cat_click",
      _event_value: getUrlParam("id"),
      _topic: "cat",
    };
    console.log("conffingDat");

    console.log(configData);
    console.log("conffingDat");
    $.get(
      document.location.protocol + "//" + "ip.kbit.kmzscc.com/",
      function (result) {
        configData._ip = result;
        localStorage.setItem("ip", result);
      }
    );
    // eslint-disable-next-line no-inner-declarations
    function initFingerprintJS() {
      FingerprintJS.load().then((fp) => {
        setTimeout(() => {
          fp.get({ debug: false }).then((result) => {
            const visitorId = result.visitorId;
            window.loggerCallback = function (opts = {}) {
              // if (location.host.match(/localhost/) || localStorage.getItem('site') == 'null' || location.host.match(/answerCloudTest/)) {
              if (
                location.host.match(/localhost/) ||
                localStorage.getItem("site") == "null"
              ) {
                return;
              }
              var u = navigator.userAgent,
                app = navigator.appVersion;
              var isAndroid =
                u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
              var logger = new window.Tracker(
                "cn-shenzhen.log.aliyuncs.com",
                "wap-common",
                "wap-common"
              );
              logger.push("app_id", configData._app_id);
              logger.push("client_ip", configData._ip);
              logger.push("device_brand", navigator.platform);
              logger.push("device_model", isAndroid ? "android" : "iPhone");
              logger.push("device_system", "web");
              logger.push("device_uuid", visitorId);
              logger.push("download_channel", "");
              logger.push(
                "event_type",
                opts.event_type || configData._event_type
              ); // 蹇呭～
              logger.push(
                "event_value",
                opts.event_value || configData._event_value
              ); // 蹇呭～
              logger.push("topic", opts.topic || configData._topic); // 蹇呭～
              logger.push("event_data", opts.event_data || "");
              logger.push("pro_id", configData._pro_id || "");
              logger.push("js_base_code", "");
              logger.push("js_unique_code", "");
              logger.push("system_version", navigator.userAgent);
              logger.push("timestamp", Date.parse(new Date()) / 1000);
              logger.push("uid", 0);
              logger.push("version", "1.0.0");
              logger.push("event_int_value", 0);
              logger.push("route_url", location.href); // 当前完整链接
              logger.push("route_referer", opts.route_referer); // 上一页链接
              logger.push("route_type", opts.route_type);
              logger.push(
                "route_value",
                opts.route_value || configData._event_value
              );
              logger.logger();
            };
          });
        });
      });
    }
    initFingerprintJS();
  }
});
