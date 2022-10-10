import request from "@/common/request";

//获取配置
function get_config(params) {
  return request({
    method: "post",
    url: "/addons_admin_api/answer/site/get_config",
    data: params,
  });
}
//结束答题。获取结果

function submit_test_paper_all(params) {
  return request({
    method: "post",
    url: "/addons_answer_api/web_api/submit_test_paper_all",
    data: params,
  });
}

//获取uid
function add_group_user(params) {
  return request({
    method: "post",
    url: "/addons_answer_api/web_api/add_group_user",
    data: params,
  });
}
export default {
  get_config,
  submit_test_paper_all,
  add_group_user,
};
