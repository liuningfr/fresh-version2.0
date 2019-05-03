import qs from 'qs';

/**
 * getQuery - 将 url 中的查询参数解析为对象
 */
const getQuery = (search) => qs.parse(search, { ignoreQueryPrefix: true });

export default getQuery;
