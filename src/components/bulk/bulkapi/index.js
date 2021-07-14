
const TIMES_API = '/times/mall-groupbuying/app';
const MALL_API = '/app/json/group_buying_order';
/*服务商城的地址*/
export const ServiceMall = "https://mall-uat-app-linli.timesgroup.cn:1443/";
export const config = {
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    }
};
/*团长端*/
/*活动商品列表*/
export const activityProductlist = TIMES_API + "/activity/app_activity_product_list";
/*活动分享页面-旅游、家政、团长活动详情*/
export const activityDetail = TIMES_API + '/activity/activity_detail';
/*活动商品详情-零售*/
export const spuInfo = TIMES_API + "/spu/select_id";
/*活动商品详情-旅游、家政*/
export const house_travel_Info = TIMES_API + '/spu/id';
/*团长活动列表*/
export const ActivityList = TIMES_API + '/activity/activity_list';
/*团长分享码*/
export const activityShareCode = TIMES_API + '/activity/activity_share_code';
/*获取业务类型*/
export const businessType = TIMES_API + "/universal/business-type";
/*团长订单列表*/
export const groupOrderList = TIMES_API + '/order/head_order_list';
/*团长订单详情*/
export const orderDetail = TIMES_API + '/order/order_detail';



