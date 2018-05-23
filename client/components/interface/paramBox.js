import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Tooltip from 'antd/lib/tooltip'
import React from 'react';

class ParamBox extends React.Component {
  constructor(props) {
    super(props);

    this.Columns = [{
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      width: '30%'
    }, {
      title: '参数含义',
      dataIndex: 'description',
      key: 'description',
      width: '35%'
    }, {
      title: '参数类型',
      dataIndex: 'type',
      key: 'type',
      width: '80px'
    }, {
      title: 'mock规则',
      dataIndex: 'rule',
      key: 'rule',
      width: '35%'
    }, {
      title: '操作',
      key: 'operation',
      width: '150px',
      render: (text, record, index) => (
        <div>
          <Tooltip title="克隆当前参数">
            <a href="#" className="ant-table-link" onClick={this.props.clone(this.props.data, record, index)}>克隆</a>
          </Tooltip>
          <a href="#" className="ant-table-link"
             onClick={this.props.showModal('edit', this.props.data, record)}>编辑</a>
          <a href="#" className="ant-table-link"
             onClick={this.props.delete(this.props.data, record, index)}>删除</a>
          {record.type === 'Object' || record.type === 'ArrayObject' ? (
            <a href="#" className="ant-table-link"
               onClick={this.props.showModal('new', this.props.data, record)}>增加子参数</a>
          ) : null}
        </div>
      )
    }];
  }

  render() {
    console.log('treeTable data is:', this.props.data);
    return (
      <div>
        <div className="container">
          <h2>{this.props.title}</h2>
          <Button icon='plus' type="primary" size="small" className="right-btn"
                  onClick={this.props.showModal('new', this.props.data, this.props.data)}>{'新增' + this.props.title}</Button>
        </div>
        <Table
          rowkey="key"
          expandedRowKeys={this.props.expandedRowKeys}
          onExpandedRowsChange={this.props.onExpandedRowsChange}
          columns={this.Columns}
          dataSource={this.props.data}
          pagination={false}
        />
      </div>
    )
  }
}

export default ParamBox;