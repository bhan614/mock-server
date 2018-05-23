import React, {Component} from 'react';
import {Upload, Icon, message, Spin, Button} from 'antd/lib';
import $ from 'jquery';

const Dragger = Upload.Dragger;

class RestoreMockPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading2: false,
      btnShow: false,
      btnText: '数据恢复完成',
      btnText2: '开始处理数据',
    };
    this.uploadProps = {
      name: 'file',
      accept: 'application/json',
      multiple: false,
      showUploadList: false,
      action: '/api/restore',
      beforeUpload: this.beforeUpload,
      onChange: this.onChange
    }
  }

  beforeUpload = () => {
    this.setState({
      loading: true
    });
  };

  onChange = (info) => {
    const status = info.file.status;
    if (status !== 'uploading') {
      this.setState({
        loading: false
      });
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      this.setState({
        loading: false,
        btnShow: true
      });
      // message.success(`${info.file.name} 文件上传成功`);
    } else if (status === 'error') {
      this.setState({
        loading: false,
        btnShow: true,
        btnText: '数据恢复失败',
      });
      // message.error(`${info.file.name} 文件上传失败`);
    }
  };

  reloadRestore = () => {
    this.setState({
      loading: false,
      btnShow: false,
    });
  };

  enterLoading = () => {
    this.setState({
      loading2: true,
      btnText2: '处理数据中...'
    })
    this.handleHistory();
  };

  handleHistory = () => {
    $.ajax({
      url: '/api/restore/history',
      type: 'get',
      dataType: 'json'
    }).done((res) => {
      if (res.code === 0) {
        message.success('数据处理成功');
      } else {
        message.error(res.msg);
      }
    }).fail((err) => {
      message.error('接口异常，稍后再试');
    }).done(() => {
      this.setState({
        loading2: false,
        btnText2: '开始处理数据',
      })
    })
  };

  render() {
    const {loading, btnShow, btnText, btnText2} = this.state;
    return (
      <div>
        <p style={{margin: '10px 0'}}>1.恢复 mongodb 数据</p>
        <Spin tip="数据处理中..." spinning={loading}>
          {
            btnShow ? (
              <div style={{height: 180, paddingTop: 60, textAlign: 'center'}}>
                {btnText}
                <p style={{marginTop: 20}}><Button onClick={this.reloadRestore}>再次上传</Button></p>
              </div>
            ) : (
              <div style={{height: 180}}>
                <Dragger {...this.uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                  </p>
                  <p className="ant-upload-text">点击或拖拽上传 Mock mongodb 数据</p>
                  <p className="ant-upload-hint">仅仅支持 JSON 数据格式</p>
                </Dragger>
              </div>
            )
          }
        </Spin>
        <p style={{margin: '10px 0', color: 'rgba(0, 0, 0, 0.43)'}}>注意：上传备份的 mongodb 数据文件（json 格式文件）</p>
        <p style={{margin: '20px 0 10px'}}>2.生成 history 表</p>
        <p>
          <Button type="primary" loading={this.state.loading2} onClick={this.enterLoading}>{btnText2}</Button>
        </p>
        <p style={{margin: '10px 0', color: 'rgba(0, 0, 0, 0.43)'}}>注意：根据 interface 表接口数据生成所有接口的备份数据到新表 history，
          在每个接口详情页可以选择接口历史版本下拉分别查看不同版本接口详情</p>
      </div>
    );
  }
}

export default RestoreMockPage;