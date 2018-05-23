import Select from 'antd/lib/select'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

class ParamModal extends React.Component {

  render() {
    const {getFieldProps, isFieldValidating, getFieldError} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16},
    };
    const nameExist = getFieldProps('name', {
      rules: [
        {required: true, message: '请填写参数名'}
      ],
    });
    const descriptionExist = getFieldProps('description', {
      rules: [
        {required: true, message: '请填写参数描述'}
      ],
    });

    return (
      <Modal title={this.props.modal.statusCode === 'edit' ? "编辑参数" : "新建参数"}
             visible={this.props.modal.visible}
             onOk={this.props.onOk}
             onCancel={this.props.onCancel}>
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            id="name"
            label="参数名"
            hasFeedback>
            <Input id="control-input" placeholder="请输入参数名称" {...nameExist}/>
          </FormItem>

          <FormItem
            {...formItemLayout}
            id="description"
            label="参数含义"
            hasFeedback>
            <Input type="textarea" id="control-textarea" rows="3" placeholder="请输入参数含义" {...descriptionExist}/>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="参数类型">
            <Select {...getFieldProps('type')} placeholder="请选择参数类型" style={{width: 200}}>
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Boolean">Boolean</Option>
              <Option value="Array">Array</Option>
              <Option value="Object">Object</Option>
              <Option value="ArrayObject">Array(Object)</Option>
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            id="rule"
            label="mock规则">
            <Input {...getFieldProps('rule')} type="textarea" rows="3" id="control-input"
                   placeholder="请输入合法的mock规则，如：@mock="/>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ParamModal = Form.create()(ParamModal);
export default ParamModal;