/**
 * 格式化查询参数，根据查询字段
 * @param {object} query 以分为单位的价格
 * @return {object} 按照后端要求的字段
 */

const filterParams = {
  per_page: undefined,
  cur_page: undefined,
  filter: {
    user_name: undefined,
    passport_name: undefined,
    privilege_type: undefined,
  },
  is_export: 0,
};
const updateParams = {
  passport_id: undefined,
  passport_name: undefined,
  passport_info: {
    user_name: undefined,
  },
  privlege: {
    privilege_type: undefined,
    shop: [],
  },
};
const addParams = {
  promotion_title: undefined,
  promotion_type: undefined,
  promotion_content: {
    promotion_product_id: undefined,
    promotion_gift_id: undefined,
  },
  promotion_time: undefined,
};
const formatQuery = (query) => {
  filterParams.per_page = query.per_page;
  filterParams.cur_page = query.cur_page;
  filterParams.filter.user_name = query.user_name;
  filterParams.filter.passport_name = query.passport_name;
  filterParams.filter.privilege_type = query.privilege_type;
  filterParams.is_export = query.is_export;
  return filterParams;
};
const formatFeeData = {};
const formatBannerData = {};

const formatUpdate = (activeId, query) => {
  updateParams.passport_id = activeId;
  updateParams.passport_name = query.passport_name;
  updateParams.passport_info.user_name = query.user_name;
  updateParams.privlege = { privlege_type: query.privilege_type, shop: query.shop };
  return updateParams;
};
const formatAdd = (query) => {
  addParams.promotion_title = query.promotion_title;
  addParams.effect_scene = query.effect_scene;
  addParams.promotion_type = query.promotion_type;
  const mainPro = query.promotion_product_list.map((item) => JSON.parse(item));
  // const gitPro = JSON.parse(query.promotion_gift);
  const gitPro = query.promotion_gift.map((item) => JSON.parse(item));
  addParams.content = {
    promotion_product_list: mainPro,
    promotion_gift: gitPro,
  };
  addParams.start_time = query.start_time.format('YYYY-MM-DD HH:mm:ss');
  addParams.cancel_time = query.cancel_time.format('YYYY-MM-DD HH:mm:ss');
  // 对于店铺地址进行处理，使之适应接口字段。
  addParams.shop_list = query.shop_list.map((item) => ({ shop_id: item }));
  return addParams;
};

const formFeeAdd = (query) => {
  formatFeeData.start_amount = Math.floor(parseFloat(query.start_amount) * 100);
  formatFeeData.package_amount = Math.floor(parseFloat(query.package_amount) * 100);
  formatFeeData.delivery_type = query.delivery_type;
  formatFeeData.province_code = query.province_code;
  formatFeeData.city_code = query.city_code;
  formatFeeData.county_code = query.county_code;
  formatFeeData.delivery_amount_list = {
    free_price: Math.floor(parseFloat(query.free_price) * 100),
    unit_price: Math.floor(parseFloat(query.unit_price) * 100),
    max_price: Math.floor(parseFloat(query.max_price) * 100),
    price: Math.floor(parseFloat(query.price) * 100),
  };
  return formatFeeData;
};
// 处理提交的数据格式 Banner界面 submit，当img为Object时候
const formatBannerAdd = (query) => {
  formatBannerData.banner_name = query.banner_name;
  formatBannerData.img_url = query.img_url.fileList[0].response.data.url;
  formatBannerData.type = query.type;
  const { appid, sku_base_id, url, coupon_package_id, category_id } = query;
  const appid_format = appid;
  if (query.type === 2) {
    formatBannerData.detail = sku_base_id;
  } else if (query.type === 4) {
    formatBannerData.detail = JSON.stringify({});
  } else if (query.type === 5) {
    formatBannerData.detail = JSON.stringify({ coupon_package_id });
  } else if (query.type === 6) {
    formatBannerData.detail = JSON.stringify({ category_id });
  } else {
    formatBannerData.detail = JSON.stringify({ appid: appid_format, url });
  }
  return formatBannerData;
};
// 处理提交的数据格式 Banner界面 submit，当img为字符串时候
const formatBannerEdit = (query) => {
  formatBannerData.banner_name = query.banner_name;
  formatBannerData.img_url = query.img_url;
  formatBannerData.type = query.type;
  const { appid, sku_base_id, url, coupon_package_id, category_id } = query;
  const appid_format = appid;
  if (query.type === 2) {
    formatBannerData.detail = sku_base_id;
  } else if (query.type === 4) {
    formatBannerData.detail = JSON.stringify({});
  } else if (query.type === 5) {
    formatBannerData.detail = JSON.stringify({ coupon_package_id });
  } else if (query.type === 6) {
    formatBannerData.detail = JSON.stringify({ category_id });
  } else {
    formatBannerData.detail = JSON.stringify({ appid: appid_format, url });
  }
  return formatBannerData;
};
// 处理新建券，编辑券提交的数据格式
const formCouponAdd = (query) => {
  const formCoupon = {};
  if (query.application_sku_list) {
    const application_sku_list = [];
    query.application_sku_list.forEach((item) => {
      application_sku_list.push(JSON.parse(item));
    });
    formCoupon.application_sku_list = JSON.stringify(application_sku_list);
  }
  formCoupon.coupon_name = query.coupon_name;
  formCoupon.coupon_type = query.coupon_type;
  if (query.coupon_type !== 1 || query.coupon_type !== 2) {
    if (query.coupon_value) {
      formCoupon.coupon_value = query.coupon_value * 100;
    }
  }
  if (query.use_limit) {
    formCoupon.use_limit = query.use_limit * 100;
  }
  formCoupon.application_shop_list = JSON.stringify({
    shop_ids: query.application_shop_list,
  });
  if (!query.use_limit) {
    formCoupon.use_limit = 0;
  }
  formCoupon.coupon_desc = query.coupon_desc;
  formCoupon.valid_period_type = query.valid_period_type;
  formCoupon.application_position = JSON.stringify(query.application_position);
  if (query.mutual_coupon) {
    formCoupon.mutual_coupon = JSON.stringify(query.mutual_coupon);
  }
  if (query.days) {
    formCoupon.valid_period = JSON.stringify({
      days: query.days,
    });
  } else if (query.start_time && query.end_time) {
    formCoupon.valid_period = JSON.stringify({
      start_time: query.start_time.format('YYYY-MM-DD HH:mm:ss'),
      end_time: query.end_time.format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  return formCoupon;
};
export {
  formatQuery,
  formatAdd,
  formatUpdate,
  formFeeAdd,
  formatBannerAdd,
  formatBannerEdit,
  formCouponAdd,
};
