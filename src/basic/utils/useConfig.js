import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import getRoute from './getRoute';

/**
 * travelChildren - 若在子页面下，还有子页面 (children)，进行递归处理
 */
const travelChildren = (children, breadMap, RouteList, parentBread, parentRoute) => {
  children.forEach((child) => {
    const { name, path, file, children: childChildren } = child;

    // 面包屑导航
    const childBread = [...parentBread];
    childBread[childBread.length - 1].link = parentRoute.path;
    childBread.push({ name });
    breadMap[path.split(':')[0]] = childBread;

    // 路由数据
    const childRoute = {
      path,
      file,
      // model
      addModel: parentRoute.addModel,
      modelName: parentRoute.modelName,
      modelFile: parentRoute.modelFile,
      // meta
      meta: { power: parentRoute.power, listPath: parentRoute.path },
    };
    RouteList.push(getRoute(childRoute));

    // 递归处理
    if (childChildren && !path.includes('/:')) {
      travelChildren(childChildren, breadMap, RouteList, childBread, childRoute);
    }
  });
};

/**
 * useConfig - 根据路由和权限数据，生成侧边栏菜单、面包屑导航、路由组件的数据
 */
const useConfig = (routesConfig, powerMap, addModel) => {
  const MenuList = [];
  const breadMap = { '/': [{ name: '首页' }] };
  const RouteList = [];

  routesConfig.forEach((top) => {
    if (top.path[0] !== '/') top.path = `/${top.path}`;

    powerMap[top.path] = { view: true, ctrl: true }; // mock
    // if (!powerMap[top.path].view) {
    //   RouteList.push(getRoute({ redirect: '/', path: top.path }));
    //   return;
    // }

    if (!top.subMenu) {
      if (!top.isHidden) {
        // 侧边栏菜单
        MenuList.push(
          <Menu.Item key={top.path}>
            <NavLink to={top.path} activeClassName="active">
              <Icon type={top.icon} />
              <span>{top.name}</span>
            </NavLink>
          </Menu.Item>,
        );
      }
      // 面包屑导航
      breadMap[top.path] = [{ name: top.name }];
      // <Route />
      const add = top.children && top.children.find(({ pageType }) => pageType === 'add');
      const topRoute = {
        path: top.path,
        file: top.file,
        // model
        addModel,
        modelName: top.modelName,
        modelFile: top.modelFile,
        // meta
        meta: {
          power: powerMap[top.path],
          btnAdd: add && { name: add.name, path: `${top.path}/add` },
        },
      };
      RouteList.push(getRoute(topRoute));

      // 一级菜单子页面
      top.children &&
        top.children.forEach((child) => {
          const path = `${child.path[0] !== '/' ? '/' : ''}${child.path}`;
          const { name, file, pageType, children } = child;

          // if (!powerMap[top.path].ctrl && (pageType === 'add' || pageType === 'edit')) {
          //   RouteList.push(getRoute({ redirect: top.path, path }));
          //   return;
          // }

          // 面包屑导航
          const childBread = [{ name: top.name, path: top.path }, { name }];
          breadMap[path.split(':')[0]] = childBread;
          // <Route />
          const childRoute = {
            path,
            file,
            // model
            addModel,
            modelName: top.modelName,
            modelFile: top.modelFile,
            // meta
            meta: { power: powerMap[top.path], pageType, listPath: top.path },
          };
          RouteList.push(getRoute(childRoute));

          // 若在一级菜单子页面下，还有子页面，递归处理
          if (children && !path.includes('/:')) {
            travelChildren(children, breadMap, RouteList, childBread, childRoute);
          }
        });
    } else {
      const subMenu = [];
      top.subMenu.forEach((sub) => {
        if (sub.path[0] !== '/') sub.path = `/${sub.path}`;

        powerMap[sub.path] = { view: true, ctrl: true }; // mock
        // if (!powerMap[sub.path].view) {
        //   RouteList.push(getRoute({ redirect: '/', path: sub.path }));
        //   return;
        // }

        if (!top.isHidden && !sub.isHidden) {
          // 侧边栏菜单
          subMenu.push(
            <Menu.Item key={sub.path}>
              <NavLink to={sub.path} activeClassName="active">
                {sub.name}
              </NavLink>
            </Menu.Item>,
          );
        }
        // 面包屑导航
        breadMap[sub.path] = [{ name: top.name }, { name: sub.name }];
        // <Route />
        const add = sub.children && sub.children.find(({ pageType }) => pageType === 'add');
        const subRoute = {
          path: sub.path,
          file: sub.file,
          // model
          addModel,
          modelName: sub.modelName,
          modelFile: sub.modelFile,
          // meta
          meta: {
            power: powerMap[sub.path],
            btnAdd: add && { name: add.name, path: `${sub.path}/add` },
          },
        };
        RouteList.push(getRoute(subRoute));

        // 二级菜单子页面
        sub.children &&
          sub.children.forEach((child) => {
            const path = `${child.path[0] !== '/' ? '/' : ''}${child.path}`;
            const { name, file, pageType, children } = child;

            // if (!powerMap[sub.path].ctrl && (pageType === 'add' || pageType === 'edit')) {
            //   RouteList.push(getRoute({ redirect: sub.path, path }));
            //   return;
            // }

            // 面包屑导航
            const childBread = [{ name: top.name }, { name: sub.name, path: sub.path }, { name }];
            breadMap[path.split(':')[0]] = childBread;
            // <Route />
            const childRoute = {
              path,
              file,
              // model
              addModel,
              modelName: sub.modelName,
              modelFile: sub.modelFile,
              // meta
              meta: { power: powerMap[sub.path], pageType, listPath: sub.path },
            };
            RouteList.push(getRoute(childRoute));

            // 若在二级菜单子页面下，还有子页面，递归处理
            if (children && !path.includes('/:')) {
              travelChildren(children, breadMap, RouteList, childBread, childRoute);
            }
          });
      });
      if (subMenu.length > 0) {
        MenuList.push(
          <Menu.SubMenu
            key={top.path}
            className={`submenu-${top.path.slice(1)}`}
            title={[<Icon key="icon" type={top.icon} />, top.name]}
          >
            {subMenu}
          </Menu.SubMenu>,
        );
      }
    }
  });
  return {
    MenuList,
    breadMap,
    RouteList,
  };
};

export default useConfig;
