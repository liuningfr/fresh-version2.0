/**
 * 得到 省份 城市 区
 */
function getAddress(obj, arr) {
  if (obj.length === 0) {
    return [];
  }
  const result = [];
  let data = JSON.parse(JSON.stringify(obj)); // 深度复制数组。
  for (let i = 0; i < arr.length; i += 1) {
    const obj_add = data.find(({ region_id }) => region_id === arr[i]) || {};
    result.push(obj_add.region_name);
    if (i === arr.length - 1) {
      break;
    }
    data = [...obj_add.children];
  }
  return result;
}
export default getAddress;
