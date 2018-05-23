/**
 * 列表组件
 */
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Tooltip from 'antd/lib/tooltip'
import message from 'antd/lib/message'
import React from 'react';
import {Link} from 'react-router';
import $ from 'jquery';

class ProjectList extends React.Component{

  delete(pid, key) {
    return () => {
      $.ajax({
        url: '/api/projects/' + pid,
        type: 'delete'
      })
      .done((data) => {
        switch(data.code) {
          case 0: 
            message.success('删除成功！');
            this.props.refresh();
            break;

          case 1: 
            message.info("您的登陆已经过期啦，打开一个新的页面重新登陆吧~");
            break;

          default: 
            message.error(data.msg);
            break;
        }        
      })
      .fail((err) => {
        message.error('Ajax请求删除失败！');
      })
    }
  }

  constructor(props) {
    super(props);

    this.columns = [{
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => <Link to={{ pathname: '/interface', query: {projectId: record._id} }}>{text}</Link>,
    }, {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
      render: (text, record) => <Tooltip title={text} placement="topLeft"><div className='ant-table-ellipsis'>{text}</div></Tooltip>,
    }, {
      title: '最后更新时间',
      key: 'updatetime',
      dataIndex: 'updatetime',
      width: 150
    },{ 
      title: '操作', 
      dataIndex: '', 
      key: 'x', 
      width: 120,
      render: (text, record) => (
        <div>
          <Link className="ant-table-link" to={{ pathname: '/interface', query: {projectId: record._id} }}>查看详情</Link>
          <Popconfirm title="确定要删除这个项目吗？" onConfirm={this.delete(record._id, record.key+1)}>
            <a className="ant-table-link" href='#'>删除</a>
          </Popconfirm>
        </div>
      ),
    }];
  }

  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.props.projectList}
        bordered
        title={() => this.props.title}
      />
    )
  }
};

export default ProjectList;