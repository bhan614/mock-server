import React, {Component, PropTypes} from 'react';
import LoginBox from '../components/user/loginBox'
import Header from '../components/composition/Header'
import Bottom from '../components/composition/Bottom'
import 'antd/dist/antd.css';

class LoginPage extends Component{
	render() {
		return (
			<div className="login">
				<h1>贝壳金控</h1>
				<h2>MOCK平台</h2>
				<LoginBox/>
			</div>
		);
	}
}

export default LoginPage;
