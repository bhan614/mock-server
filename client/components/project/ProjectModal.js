/**
 * 对话框组件
 */
import React, {Component} from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import $ from 'jquery';
let FormItem = Form.Item;

class ProjectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          this.handleSubmit()
        }
      },
    );
  }

  // 点击创建新项目
  handleSubmit = () => {
    this.setState({loading: true});
    $.ajax({
      url: '/api/projects',
      type: 'post',
      data: {
        name: $('#name').val(),
        description: $('#description').val()
      }
    })
      .done((data) => {
        switch (data.code) {
          case 0:
            this.props.refresh();
            break;

          case 1:
            message.info("您的登陆已经过期啦，打开另一个页面重新登陆吧~");
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
        console.log('Sended');
        this.setState({loading: false, visible: false});
      })
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  render() {
    const {getFieldProps} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const nameExist = getFieldProps('name', {
      rules: [
        {required: true, message: '请填写项目名'}
      ],
    });
    const descriptionExist = getFieldProps('description', {
      rules: [
        {required: true, message: '请填写项目描述'}
      ],
    });
    return (
      <div className="container">
        <Button className="right-btn" icon="plus" type="primary" onClick={this.showModal}>
          {this.props.title}
        </Button>
        <Modal ref="modal"
               visible={this.state.visible}
               title={this.props.title} onOk={this.handleOk} onCancel={this.handleCancel}
               footer={[
                 <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
                 <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                   提 交
                 </Button>,
               ]}
        >
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              id="name"
              label="项目名"
            >
              <Input id="name" placeholder="Please enter..." {...nameExist}/>
            </FormItem>

            <FormItem
              {...formItemLayout}
              id="description"
              label="描述"
            >
              <Input type="textarea" id="description" rows="3"  {...descriptionExist}/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
;

export default Form.create()(ProjectModal);