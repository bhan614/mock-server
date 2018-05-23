import React, {Component} from 'react';
import $ from 'jquery';
import { Button, message } from 'antd';
import { Link, history } from 'react-router';
import InterfaceChange from '../events/InterfaceChange';
import InterfaceList from '../components/interface/interfaceList';

function getQueryString(name) {
	let reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", "i");
	let query = window.location.search.substr(1).match(reg);
	return query ? query[1] : null;
}

function dateToString(date) {
	let oDate = new Date(date) == "Invalid Date" ? new Date(Number(date)) : new Date(date),
		sYear = oDate.getFullYear(),
		sMonth = oDate.getMonth() + 1,
		sDate = oDate.getDate(),
		sHour = oDate.getHours(),
		sMinutes = oDate.getMinutes(),
		sSeconds = oDate.getSeconds();
	return  sYear+ '-' + sMonth + '-' + sDate + ' ' + sHour + ':' + sMinutes + ':' + sSeconds;
}

class InterfaceListPage extends Component{

	constructor(props) {
		super(props);
		this.state = {
			interfaceList: [
				/*{
				 name: '接口名称',
				 description: '接口描述',
				 uri: '接口地址',
				 type: '请求类型',
				 updatetime: '最后更新时间',
				 key: index
				 }*/
			]
		};
	}
	
	componentDidMount() {
		this.getInterfaceList();
		InterfaceChange.addEvent(()=>{
			this.getInterfaceList();
		});
	}

	getInterfaceList() {
		window.pId = getQueryString('projectId');
		$.ajax({
			url: '/api/projects/' + pId + '/interfaces',
			type: 'get',
			dataType: 'json'
		})
		.done((data) => {
			switch(data.code) {
				case 0: 
					let interfaceList = data.data.interfaceList;
					interfaceList.forEach((_interface, index) => {
						_interface.key = index;
						_interface.updatetime =dateToString(_interface.updatetime);
					}); 
					this.setState({
						interfaceList: interfaceList
					});
					break;

				case 1: 
					message.info("您的登陆已过期，请重新登陆");
					setTimeout(() => {
						window.location.href = '/index/login';
					}, 1000);
					break;

				default: 
					message.error(data.msg);
					break;
	        }   
			
		})
		.fail((err) => {
			console.log(err);
		})
		.always(() => {
			console.log('get interface list complete');
		})
	}

	exportExcel() {

	}
	refresh() {
		return this.getInterfaceList.bind(this);
	}

	toInterfaceDetail(pId) {
		return () => {
			this.context.router.push('/interface/detail?projectId=' + pId);
		}
	}

	render() {
		let pId = getQueryString('projectId');	
		return (
			<div>
				<div>
					<Link to={'/index'}>&lt;&lt;&nbsp;返回项目列表</Link>
					<a href={"/api/projects/"+ pId + "/interfaces/excel"}><Button icon="upload" type="primary" className="right-btn">导出Excel</Button></a>
					<Button icon="plus" type="primary" className="right-btn" onClick={this.toInterfaceDetail(pId)}>
						新建接口
			        </Button>
			        <div className="clear"></div>
				</div>
				<InterfaceList title="接口列表" pId={pId} refresh={this.refresh()} interfaceList={this.state.interfaceList}/>
			</div>
		);
	}
}

InterfaceListPage.contextTypes={
	router:React.PropTypes.object.isRequired
}

export default InterfaceListPage;