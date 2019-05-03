import React, { Component } from 'react';
import { Popover, Alert, Table, Icon } from 'antd';
import { exportPopover, exportBtn, redDot } from './Export.scss';

const popoverProps = {
  overlayClassName: exportPopover,
  trigger: 'click',
  placement: 'bottomRight',
  getPopupContainer: (node) => node.parentNode,
  arrowPointAtCenter: true,
};
class Export extends Component {
  constructor(props) {
    super(props);
    this.successTip = <Alert message="导出任务已添加" type="success" showIcon />;
    this.columns = [
      { dataIndex: 'export_name' },
      { dataIndex: 'create_time' },
      {
        dataIndex: 'status',
        render: (status, { download_url }) => {
          if (status === 0) return '待运行';
          if (status === 1) return '导出中...';
          if (status === 2) return <a href={download_url}>保存到本地</a>;
          if (status === 3) return '导出异常';
          return null;
        },
      },
    ];
    this.state = {
      showTip: false, // 显示导出提示
      showList: false, // 显示导出列表
    };
  }
  componentDidMount() {
    document.addEventListener('click', this.onTipHide, false);
  }
  componentWillReceiveProps({ dot }) {
    if (dot) {
      this.setState({ showTip: true });
      this.tipTimer = setTimeout(() => {
        this.setState({ showTip: false });
      }, 3000);
    }
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.onTipHide, false);
  }
  // 点击页面时，隐藏导出提示
  onTipHide = (event) => {
    const { showTip } = this.state;
    if (showTip && event.target.innerText !== '导 出') {
      this.setState({ showTip: false });
      clearTimeout(this.tipTimer);
    }
  };
  // 点击图标，获取导出列表
  onListVisibleChange = (showList) => {
    this.setState({ showList });
    if (showList) {
      const { getList } = this.props;
      getList();
    }
  };
  // 图标
  iconCloud = () => {
    const { dot } = this.props;
    return <Icon type="cloud-download" className={[exportBtn, dot ? redDot : '']} />;
  };
  // 导出列表 table
  exportList = () => {
    const { loading, list } = this.props;
    return (
      <Table
        loading={loading.getExportList}
        columns={this.columns}
        dataSource={list}
        showHeader={false}
        pagination={false}
        rowKey="id"
      />
    );
  };

  render() {
    const { showTip, showList } = this.state;
    return showTip ? (
      <Popover {...popoverProps} content={this.successTip} visible key="tip">
        {this.iconCloud()}
      </Popover>
    ) : (
      <Popover
        {...popoverProps}
        content={this.exportList()}
        visible={showList}
        onVisibleChange={this.onListVisibleChange}
        key="table"
      >
        {this.iconCloud()}
      </Popover>
    );
  }
}

export default Export;
