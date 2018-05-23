/**
 * 页面入口，包含Header、Sidebar和子路由
 */

import React, { Component } from 'react';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import $ from 'jquery';
import Sider from '../components/composition/Sider';
import Header from '../components/composition/Header';
import Bottom from '../components/composition/Bottom';
import 'antd/dist/antd.css';


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

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			user: {},
			projectList: []
		};
	}

	getProjectList() {
		$.ajax({
	      url: '/api/projects',
	      type: 'get'
	    })
	    .done((data) => {
	    	data.data.projectList.forEach((proj, index) => {
	    		proj.updatetime = dateToString(proj.updatetime);
	    		proj.key = index;
	    	});
			this.setState({
				projectList: data.data.projectList
			})
	    })
	    .fail((err) => {
	    	console.log(err);
	    })
	}

	getLoginInfo() {
		$.ajax({
			url: '/api/loginInfo',
			type: 'get'
		})
		.done((data) => {
			if(data.code == 1) {
				window.location.href = '/index/login';
			} else {
				this.setState({
					user: data.data
				});
			}
		})
	}

	componentDidMount() {
		this.getProjectList();
		this.getLoginInfo();		
	}

	refresh() {
		return this.getProjectList.bind(this);
	}

	render() {
		return (
			<div className="ant-layout-topaside">
			    <Header user={this.state.user}/>
			    <div className="ant-layout-wrapper">
			        <div className="ant-layout-container">
			        	<aside className="ant-layout-sider">
			        		<Sider ref="sidebar" defaultOpenKeys={['projectList']} data={this.state.projectList}/>
			        	</aside>
			        	<div className="ant-layout-main">
			                <div className="ant-layout-content">
			                	{this.props.children && React.cloneElement(this.props.children, 
			                		{projectList: this.state.projectList, refresh: this.refresh(), user: this.state.user})
			                	}
			                </div>
			        	</div>
			        </div>
			    </div>
			    <Bottom/>
			</div>
		)
	}
}


/*App.contextTypes={
	router:React.PropTypes.object.isRequired
}*/

export default App;