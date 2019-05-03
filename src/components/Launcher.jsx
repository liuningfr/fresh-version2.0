import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import sftc from '@/basic/assets/logo.png';
import styles from './Launcher.scss';

const renderMap = {
  loading: <div className={styles.loading} />,
  loadingBars: <div className={styles.loadingBars} />,
  error: {
    title: 'Error',
    showFooter: (error) => <p>{error.message}</p>,
  },
  403: {
    title: '无权限',
    showFooter: (redirect) => (
      <Link to={redirect}>
        <Button type="primary">返回</Button>
      </Link>
    ),
  },
  404: {
    title: '404',
    showFooter: () => <p>呀，页面不存在！</p>,
  },
  home: {
    logo: <img src={sftc} alt="SFTC" />,
    title: 'Fresh',
  },
};

const Launcher = ({ type, data }) => {
  const render = renderMap[type];
  if (render === undefined) return null;
  if (type === 'loading' || type === 'loadingBars') return render;

  const { logo, title, showFooter } = render;
  const className = Number.isNaN(+type) ? type : `page${type}`;
  return (
    <div className={styles[className]}>
      {logo}
      <h2>{title}</h2>
      {showFooter && showFooter(data)}
    </div>
  );
};

export default Launcher;
