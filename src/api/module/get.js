import request from "@/common/request";

//获取新闻详情
function getNewsDetail(params) {
  return request({
    method: "get",
    url: "/addons_news_api/news/getNewsDetail",
    params,
  });
}

//项目列表（一个站点的所有项目）（包含判断当前用户是否通过）
function siteProjectList(params) {
  return request({
    method: "get",
    url: "/addons_answer_api/web_api/siteProjectList",
    params,
  });
}

//答题配置信息
function answer_config(params) {
  return request({
    method: "get",
    url: "/addons_answer_api/web_api/get_config",
    params,
  });
}

//用户获取题目列表

function question_list(params) {
  return request({
    method: "get",
    url: "/addons_answer_api/web_api/question_list",
    params,
  });
}

//分享配置
function getWechatJssdk(params) {
  return request({
    method: "get",
    url: "/wechatAddons/getWechatJssdk",
    params,
  });
}
//分享埋点
function shareCount(params) {
  return request({
    method: "get",
    url: "/addons_answer_api/web_api/shareCount",
    params,
  });
}
export default {
  siteProjectList,
  getNewsDetail,
  answer_config,
  question_list,
  shareCount,
  getWechatJssdk,
};
