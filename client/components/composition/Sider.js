/**
 * 导航栏
 */

import React, { Component } from 'react';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import $ from 'jquery';
import InterfaceChange from '../../events/InterfaceChange';
import 'antd/dist/antd.css';

const SubMenu = Menu.SubMenu;
function getQueryString(name) {
	let reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", "i");
	let query = window.location.search.substr(1).match(reg);
	return query ? query[1] : null;
}

class Sider extends Component{

	handleClick = (e) => {
		this.context.router.push('/interface?projectId=' + e.key);
		InterfaceChange.dispatch();
	}

	render() {
		let MenuItems = [];
		let selectedKeys = [];
		this.props.data.forEach(function(item, index){
			if(getQueryString('projectId')==item._id){
				selectedKeys.push(item._id);
			}
			MenuItems.push(<Menu.Item key={item._id}>{item.name}</Menu.Item>)
		})

		return (
			<Menu onClick={this.handleClick}
			    defaultOpenKeys={this.props.defaultOpenKeys}
			    selectedKeys={selectedKeys}
			    mode="inline"
			>
			  <SubMenu key="projectList" title={<span><Icon type="user" />我的项目</span>}>
			    { MenuItems }
			  </SubMenu>
			</Menu>
		)
	}
}


Sider.contextTypes={
	router:React.PropTypes.object.isRequired
}

export default Sider;