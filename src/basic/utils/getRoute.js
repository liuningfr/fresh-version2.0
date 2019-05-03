import React from 'react';
import loadable from 'loadable-components';
import { connect } from 'react-redux';
import { withStore } from '@/store';
import { Form } from 'antd';
import Launcher from '@/components/Launcher';
import { Route } from 'react-router-dom';

/**
 * load - 异步加载页面组件与 model
 */
const load = (file, addModel, modelName, modelFile) =>
  loadable(
    async () => {
      const [Page, model] = await Promise.all([
        import(`@/pages/${file}`),
        modelFile && import(`@/pages/${modelFile}`),
      ]);
      if (!modelFile) {
        return connect(...withStore('basic'))(Form.create()(Page.default));
      }
      addModel(modelName, model.default);
      return connect(...withStore('basic', modelName))(Form.create()(Page.default));
    },
    {
      render: ({ loading, error, Component, ownProps }) => {
        if (loading) return <Launcher type="loading" />;
        if (error) return <Launcher type="error" data={error} />;
        return <Component {...ownProps} />;
      },
    },
  );

/**
 * getRoute - 获取 <Route />
 */
const getRoute = ({ redirect, path, ...route }) => {
  if (redirect !== undefined) {
    const Forbidden = () => <Launcher type="403" data={redirect} />;
    return <Route key={path} path={path} render={Forbidden} exact />;
  }
  const { file, addModel, modelName, modelFile, meta } = route;
  const Loaded = load(file, addModel, modelName, modelFile);

  const Component = (props) => <Loaded {...props} {...meta} />;
  return <Route key={path} path={path} render={Component} exact />;
};

export default getRoute;
