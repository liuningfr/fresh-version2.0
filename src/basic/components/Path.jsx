import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { path } from './Path.scss';

/**
 * Path - 面包屑导航组件
 * @param {array} list - 导航数据源 e.g. [{ name: '首页', path: '/'}, { name: '关于'}]
 */
const Path = ({ list }) =>
  Array.isArray(list) &&
  list.length > 0 && (
    <Breadcrumb className={path}>
      {list.map(({ name, path: url }) => (
        <Breadcrumb.Item key={name}>
          {url ? <NavLink to={url}>{name}</NavLink> : name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );

export default Path;
