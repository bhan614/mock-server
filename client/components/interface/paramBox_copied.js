import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
// import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import React from 'react';

class ParamBox extends React.Component{
	constructor(props) {
		super(props);

		this.Columns = [{
		  title: '参数名',
		  dataIndex: 'name',
		  key: 'name',
		  width: 20
		}, {
		  title: '参数含义',
		  dataIndex: 'description',
		  key: 'description',
		  width: 10
		}, {
		  title: '参数类型',
		  dataIndex: 'type',
		  key: 'type',
		  width: 10
		}, {
		  title: 'mock规则',
		  dataIndex: 'rule',
		  key: 'rule',
		  width: 40
		},{
		  title: '操作',
		  key: 'operation',
		  render: (text, record) => (
		    <div>
		    	<a href="#" className="ant-table-link" onClick={this.props.edit()}>编辑</a>
		    	<a href="#" className="ant-table-link" onClick={this.props.new(this.props.data)}>增加子参数</a>
		    	<a href="#" className="ant-table-link" onClick={this.props.delete(this.props.data)}>删除</a>
		    </div>
		  ),
		  width: 20
		}];

	}

	render() {
		return (
			<div>
				<div className="container">
		    		<h2>{this.props.title}</h2>
		    		<Button icon='plus' type="primary" size="small" className="right-btn" onClick={this.props.new(this.props.data)}>{'新增' + this.props.title}</Button>
		    	</div>
		    	<Table columns={this.Columns} dataSource={this.props.data} pagination={false} />
			</div>
      	)
	}
}

export default ParamBox;