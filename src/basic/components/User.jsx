import React from 'react';
import { Popover, Button, Icon } from 'antd';
import { user } from './User.scss';

const User = ({ info, onLogout }) => (
  <div className={user}>
    {info.name === undefined ? (
      <Button>
        <span className="is-login">登录中...</span>
      </Button>
    ) : (
      <Popover
        trigger="click"
        placement="bottomRight"
        getPopupContainer={(node) => node}
        content={<Button onClick={onLogout}>退出登录</Button>}
      >
        <Button>
          {info.name}
          <Icon type="down" />
        </Button>
      </Popover>
    )}
  </div>
);

export default User;
