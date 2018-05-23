/**
 * 顶部
 */

import React, { Component } from 'react';
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import $ from 'jquery';

class Header extends Component{

	render() {

		return (
			<div className="ant-layout-header">
		        <div className="ant-layout-wrapper">
		          	<a href='/index'>
						<span className="ant-layout-logo-text">MOCK平台</span>
		          	</a>
		          	<div className="logout">
						<span>您好，{this.props.user.fullname}&nbsp;(&nbsp;{this.props.user.email}&nbsp;)&nbsp;|&nbsp;&nbsp;</span>
						<a href="/api/logout">
							<Icon type="logout" />
						</a>
					</div>
		        </div>
		    </div>
		)
	}
}

export default Header;
