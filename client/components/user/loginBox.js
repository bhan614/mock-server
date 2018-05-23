/**
 * 登陆组件
 */
import {Form, Input, Button, Checkbox, message} from 'antd';
import React from 'react';
import $ from 'jquery';

const FormItem = Form.Item;

let LoginBox = React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    let loginData = this.props.form.getFieldsValue();

    $.ajax({
      url: '/api/login',
      type: 'post',
      data: loginData,
    })
    .done(function(data) {
      if(data.code == 0){
        window.location.href = '/index/';
      } else {
        message.error('用户名或密码错误！');
        this.props.form.resetFields();
      }
    })
    .fail(function() {
        alert('login fail!');
    })
    .always(function() {
        console.log('complete');
    })
  },

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit} className="form">
        <FormItem {...formItemLayout}>
          <Input placeholder="请输入用户名" name="username"
            {...getFieldProps('username')}
          />
        </FormItem>
        <FormItem {...formItemLayout}>
          <Input type="password" placeholder="请输入密码" name="password"
            {...getFieldProps('password')}
          />
        </FormItem>
        <FormItem 
          wrapperCol={{ span: 10, offset: 7 }}
        >
          <Button type="primary" size="large" htmlType="submit" className="button">登录</Button>
        </FormItem>
      </Form>   
    );
  },
});

LoginBox = Form.create()(LoginBox);

export default LoginBox;