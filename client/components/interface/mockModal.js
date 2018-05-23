import React from 'react';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';

const FormItem = Form.Item;

class MockModal extends React.Component {

  copy = (e) => {
    let selDOM = e.target;
    if (selDOM && selDOM.select) {
      selDOM.select();

      try {
        document.execCommand('copy');
        // selDOM.blur();
        message.success('已经复制到剪贴板啦~');
      } catch (err) {
        message.info('按中 Ctrl/Cmd+C 复制到剪贴板');
      }
    }
  }

  render() {
    const {getFieldProps} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 20}
    }

    return (
      <Modal
        title="生成MOCK数据"
        visible={this.props.modal.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        cancelText="关闭"
        okText="刷新"
        width="50vw">
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            id="rule"
            label="mock规则">
            <div onClick={this.copy}>
              <Input
                type="textarea"
                autosize={{minRows: 2, maxRows: 8}}
                {...getFieldProps('rule', {initialValue: JSON.stringify(this.props.modal.rule, null, 4)})}
              />
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            id="data"
            label="mock数据">
            <div onClick={this.copy}>
              <Input
                type="textarea"
                autosize={{minRows: 2, maxRows: 8}}
                {...getFieldProps('data', {initialValue: JSON.stringify(this.props.modal.data, null, 4)})}
              />
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            id="data"
            label="在线接口地址">
            <div>
              <a href={this.props.modal.uri} target="_blank">{this.props.modal.uri}</a>
            </div>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

MockModal = Form.create()(MockModal);
export default MockModal;