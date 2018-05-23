import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Mock from 'mockjs';
import Spin from 'antd/lib/spin';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Message from 'antd/lib/message';
import Select from 'antd/lib/select';
import Affix from 'antd/lib/affix';
import ParamBox from '../components/interface/paramBox';
import ParamModal from '../components/interface/paramModal'
import MockModal from '../components/interface/mockModal'
import $ from 'jquery';
import _ from 'underscore';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Confirm = Modal.confirm;
const Option = Select.Option;
let now = Number(new Date);

/**
 * [searchTarget 查找嵌套数组对象]
 * @param  {[object]} target     [目标对象]
 * @param  {[array]} sourceData [目标对象所在的数组]
 * @return {[type]} index       [目标对象的单层索引]
 */

// 递归查找目标数组
function searchTarget(sourceData, target, index) {
  let result = {}
  for (let i = 0; i < sourceData.length; i++) {
    // 检查val
    if (sourceData[i] == target) {
      result = {
        parent: sourceData,
        target: target
      };
      break;
    }
    // 检查val的子参数
    else if (!!sourceData[i].children) {
      let _tmp = searchTarget(sourceData[i].children, target, index);
      if (JSON.stringify(_tmp) != '{}') {
        result = _tmp;
        break;
      } else {
        continue;
      }
    }
  }

  return result;
}

// 获取参数
function getQueryString(name) {
  let reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", "i");
  let query = window.location.search.substr(1).match(reg);
  return query ? query[1] : '';
}

// 深度克隆对象
function deepClone(obj) {
  if (!obj || !_.isObject(obj)) return obj
  const _obj = _.isArray(obj) ? [] : {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      const o = obj[i]
      if (_.isObject(o)) {
        if (!_.isArray(o)) {
          o.key = ++now
        }
        _obj[i] = deepClone(o)
      } else {
        _obj[i] = o
      }
    }
  }
  _obj.key = ++now
  return _obj
}

class InterfaceDetailPage extends React.Component {

  constructor(props) {
    super(props);

    this.ProjectId = getQueryString('projectId');
    this.InterfaceId = getQueryString('interfaceId');
    this.state = {
      loading: true, // 数据加载 loading
      modal: {
        visible: false,
        statusCode: '',  // new or edit
        target: {}   // 当前正在操作的数据
      },
      data: {
        name: '',
        description: '',
        uri: '',
        type: '',
        reqParams: [],
        resParams: []
      },
      mock: {
        visible: false,
        uri: '',
        type: '',
        rule: {},
        data: {}
      },
      expandedRowKeys: {
        req: [],
        res: []
      },
      historyVesions: [],
    }
  }

  componentDidMount() {
    /*如果是详情页，则对status进行初始化*/
    console.log("itfID", this.InterfaceId);
    if (!!this.InterfaceId) {
      $.ajax({
        url: '/api/projects/' + this.ProjectId + '/interfaces/' + this.InterfaceId,
        type: 'get'
      }).done((data) => {
        console.log('detail', data);
        switch (data.code) {
          case 0:
            this.props.form.setFieldsValue(data.data);
            this.setState({
              data: data.data,
              expandedRowKeys: {
                req: this.getExpandedKeys(data.data.reqParams),
                res: this.getExpandedKeys(data.data.resParams)
              }
            });
            break;
          case 1:
            Message.info("您的登录已过期，请重新登录");
            setTimeout(() => {
              window.location.href = '/index/login';
            }, 1000);
            break;
          default:
            Message.error(data.msg);
            break;
        }

      }).fail((err) => {
        Message.error("请求失败了，让前端程序员看看吧！");
      }).always(() => {
        this.setState({
          loading: false
        })
      })

      // 获取当前接口历史版本
      this.getInterfaceVersion()
    } else {
      this.setState({
        loading: false
      })
    }
  }

  getExpandedKeys = (data) => {

    let keys = [];
    data.forEach((item) => {
      keys.push(item.key);

      if (!!item.children) {
        let temp = this.getExpandedKeys(item.children);
        keys.push(...temp);
      }
    })

    return keys;
  }

  copy = () => {
    $.get({
      url: '/api/projects/' + this.ProjectId + '/interfaces/copy/' + this.InterfaceId,
    }).done((data) => {
      this.InterfaceId = data.data._id;
      this.props.form.setFieldsValue(data.data);
      this.setState({
        data: data.data
      });
      this.context.router.push('/interface/detail?projectId=' + this.ProjectId + '&interfaceId=' + data.data._id);
    })
  }

  getMock = () => {
    let reqParams = this.state.data.reqParams,
      resParams = this.state.data.resParams;
    let data = {
      reqParams: reqParams,
      resParams: resParams
    };

    $.ajax({
      url: '/api/projects/' + this.ProjectId + '/interfaces/mock',
      type: 'post',
      data: JSON.stringify(data),
      contentType: "application/json;charset=utf-8"
    }).done((data) => {
      let mockRuleObj = eval('(' + data.data + ')'),
        mockDataObj = Mock.mock(mockRuleObj);
      this.setState({
        mock: {
          visible: true,
          rule: mockRuleObj,
          data: mockDataObj,
          type: this.state.data.type,
          uri: '/mock/' + this.ProjectId + (this.state.data.uri.indexOf('/') === 0 ? this.state.data.uri : ('/' + this.state.data.uri))
        }
      }, () => {
        this.handleRefresh()
      });
    }).fail((err) => {
      Message.err("请求失败了，让前端程序员看看吧！");
    })
  };

  // 获取当前接口所有历史版本
  getInterfaceVersion = (version) => {
    $.ajax({
      url: `/api/historys/${this.ProjectId}/interfaces/${this.InterfaceId}`,
      type: 'get'
    }).done((res) => {
      switch (res.code) {
        case 0:
          this.setState({
            historyVesions: res.data.interfaceList || []
          });
          break;
        case 1:
          Message.info("您的登录已过期，请重新登录");
          setTimeout(() => {
            window.location.href = '/index/login';
          }, 1000);
          break;
        default:
          Message.error(res.msg);
          break;
      }
    }).fail((err) => {
      Message.error("请求失败了，让前端程序员看看吧！");
    })
  }

  // 根据 _id 从 history 表中获取当前接口所选历史版本详情
  getHistoryDetail = (version) => {
    this.setState({
      loading: true
    })
    $.ajax({
      url: `/api/historys/${version}`,
      type: 'get'
    }).done((res) => {
      switch (res.code) {
        case 0:
          const data = res.data;
          data._id = this.InterfaceId; // 重置 _id 为当前接口 _id，避免修改 history 表中记录
          this.props.form.setFieldsValue(data);
          this.setState({
            data,
            expandedRowKeys: {
              req: this.getExpandedKeys(data.reqParams),
              res: this.getExpandedKeys(data.resParams)
            }
          });
          break;
        case 1:
          Message.info("您的登录已过期，请重新登录");
          setTimeout(() => {
            window.location.href = '/index/login';
          }, 1000);
          break;
        default:
          Message.error(res.msg);
          break;
      }
    }).fail((err) => {
      Message.error("请求失败了，让前端程序员看看吧！");
    }).always(() => {
      this.setState({
        loading: false
      })
    })
  }

  exportExcel = (event) => {
    let tabs = Array.prototype.slice.call(document.getElementsByTagName("table"));
    let tab_text =
      "<table border='1'><tr><th>接口名</th><td colspan='3'>"
      + this.state.data.name + "</td></tr><tr><th>接口描述</th><td colspan='3'>"
      + this.state.data.description + "</td></tr><tr><th>接口地址</th><td colspan='3'>"
      + this.state.data.uri + "</td></tr><tr><th>接口类型</th><td colspan='3'>"
      + this.state.data.type + "</td></tr><tr></table>";
    tabs.forEach((tab) => {
      tab_text += "<table border='1'><thead><tr>";
      /*thead*/
      let ths = tab.tHead.getElementsByTagName("th");
      for (let i = 0; i < ths.length - 1; i++) {
        tab_text += ths[i].outerHTML;
      }
      tab_text += "</tr></thead><tbody>";
      /*tBody*/
      let trs = Array.prototype.slice.call(tab.tBodies[0].getElementsByTagName("tr"));
      let father = "", current_level = 0;
      trs.forEach((tr) => {
        let level = tr.className.match(/ant-table-row-level-(\d+)/)[1];
        let tds = tr.getElementsByTagName("td");
        // let TAB = "";
        // for(let k=0; k<level; k++) { TAB += " ---" }
        let td0 = tds[0].innerText.indexOf('|') ? tds[0].innerText.slice(0, tds[0].innerText.indexOf('|')) : tds[0].innerText;
        if (level == 0) {
          father = tds[0].innerText + "."
          tab_text += "<tr><td>" + td0 + "</td>";
        } else {

          tab_text += "<tr><td>" + father + td0 + "</td>";
          if (current_level != level) {
            father += tds[0].innerText + ".";
            current_level = level;
          }
        }

        for (let j = 1; j < tds.length - 1; j++) {
          tab_text += tds[j].outerHTML;
        }
        tab_text += "</tr>";
      })
      tab_text += "</tbody></table>"
    });

    event.currentTarget.href = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
  }

  submit = () => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        Message.error("请填写必要的接口信息！");
      } else {
        let basicInfo = this.props.form.getFieldsValue();
        let data = {
          ...this.state.data,
          ...basicInfo
        };

        this.setState({
          loading: true,
        })
        $.ajax({
          url: '/api/projects/' + this.ProjectId + '/interfaces/' + this.InterfaceId,
          type: 'post',
          data: JSON.stringify(data),
          contentType: 'application/json'
        }).done((resp) => {
          switch (resp.code) {
            case 0:
              Message.info("保存成功！");
              // 这里会不会造成多次点击发起多个Ajax的问题？
              this.InterfaceId = resp.data._id;
              this.setState({
                data: resp.data,
              }, () => {
                this.getInterfaceVersion()
              });
              break;
            case 1:
              Message.info("您的登录已经过期啦，不要乱动哦，打开一个页面重新登录吧~");
              break;
            default:
              Message.error(resp.msg);
              break;
          }
        }).fail((err) => {
          Message.error('请求失败了，让前端程序员看看吧！');
        }).always(() => {
          this.setState({
            loading: false,
          })
        });
      }
    });
  };

  /**
   * [显示编辑框并填充待操作数据]
   * @param  {[Array]} sourceData [目标对象所属的源数组]
   * @param  {[String]} statusCode [操作方法edit或new，用以判断是否需要进行填充]
   * @param  {[String]} target    [当前操作的对象]
   */
  showModal = (statusCode, sourceData, target) => {
    return (e) => {
      let show = statusCode === 'edit' ? target : {
        name: '',
        description: '',
        type: '',
        rule: ''
      };
      this.refs.paramModalForm.setFieldsValue(show);

      this.setState({
        modal: {
          visible: true,
          statusCode: statusCode,
          target: target
        }
      });
      e.preventDefault();
    }
  };

  // 删除一个参数
  delete = (sourceData, record, index) => {
    return (e) => {
      e.preventDefault();

      let result = searchTarget(sourceData, record, index);
      console.log(result);
      let parent = result.parent;
      parent.splice(index, 1);

      this.setState(this.state);
    }
  };

  // clone 一个请求参数/响应参数
  clone = (sourceData, record, index) => {
    return (e) => {
      e.preventDefault();

      let result = searchTarget(sourceData, record, index);
      console.log(result)
      let parent = result.parent;
      let target = deepClone(result.target);
      parent.splice(index, 0, target);

      this.setState(this.state);
    }
  };

  /**
   * [保存数据]
   * @param  {[String]} statusCode
   */

  handleOk = (statusCode) => {
    return () => {
      this.refs.paramModalForm.validateFields((errors, values) => {
        if (!!errors) {
          Message.error("请填写必要的参数信息！");
        } else {
          let formData = this.refs.paramModalForm.getFieldsValue();
          if (statusCode === 'edit') {
            for (let prop in formData) {
              if (formData.hasOwnProperty(prop)) {
                this.state.modal.target[prop] = formData[prop];
              }
            }
            this.setState({
              modal: {
                visible: false,
                target: {}
              }
            });
          } else {
            if (!formData.rule) {
              formData.rule = "";
            }
            formData.key = Date.now() + this.props.user.userId;
            console.log(formData.key);

            // 如果目标对象是根参数
            if (Array.isArray(this.state.modal.target)) {
              this.state.modal.target.push(formData);
            } else {
              if (!this.state.modal.target.children) {
                this.state.modal.target.children = [];
              }
              this.state.modal.target.children.push(formData);
            }
            this.setState({
              modal: {
                visible: false,
                target: {}
              }
            });
          }
        }
      })
    }
  };

  handleCancel = (e) => {
    this.setState({
      modal: {
        visible: false
      },
      mock: {
        visible: false
      }
    });
  };

  handleRefresh = (e) => {
    let rule = this.state.mock.rule;
    this.refs.mockModalForm.setFieldsValue({
      data: JSON.stringify(Mock.mock(rule), null, 4)
    });
  };

  handleChange = (value) => {
    this.getHistoryDetail(value)
  }

  onReqExpandedRowsChange = (rows) => {
    let expandedRowKeys = Object.assign(this.state.expandedRowKeys, {
      req: rows
    });
    this.setState(expandedRowKeys);
  }

  onResExpandedRowsChange = (rows) => {
    let expandedRowKeys = Object.assign(this.state.expandedRowKeys, {
      res: rows
    });
    this.setState(expandedRowKeys);
  }

  render() {
    console.log('state', this.state.data.reqParams);  // render渲染的次数太多了，怎么优化？

    const {getFieldProps, isFieldValidating, getFieldError} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 18},
    };
    const nameExist = getFieldProps('name', {
      rules: [
        {required: true, message: '请填写接口名称'},
      ],
    });
    const descriptionExist = getFieldProps('description', {
      rules: [
        {required: true, message: '请填写接口描述'},
      ],
    });
    const uriExist = getFieldProps('uri', {
      rules: [
        {required: true, message: '你没有写接口地址哦'},
      ],
    });

    return (
      <Spin tip="加载中..." spinning={this.state.loading}>
        <div className="container">
          <h2>接口详情</h2>
          <iframe id="txtArea" className="hide"/>
          <Affix style={{height: 40}}>
            <div style={{height: 40, backgroundColor: '#fff'}}>
              <Button icon="copy" type="primary" className="right-btn"
                      onClick={this.copy}>创建副本</Button>
              <Button icon="caret-circle-o-right" type="primary" className="right-btn"
                      onClick={this.getMock}>Mock</Button>
              <Select
                showSearch
                style={{float: 'right', width: 300, margin: '5px 18px 5px 0'}}
                placeholder="选择历史版本"
                optionFilterProp="children"
                onChange={this.handleChange}
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                  this.state.historyVesions.map((d, i) => {
                    return (
                      <Option key={i}
                              value={d._id.toString()}
                              title={d._id}>
                        {`${d._id.substr(0, 8)}(${d.user.fullname} 修改于 ${moment(Number(d.updatetime)).format('YYYY-MM-DD hh:mm:ss')})`}
                      </Option>
                    )
                  })
                }
              </Select>
            </div>
          </Affix>
        </div>
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            id="name"
            label="接口名"
            hasFeedback>
            <Input placeholder="请输入接口名称" {...nameExist}/>
          </FormItem>

          <FormItem
            {...formItemLayout}
            id="description"
            label="接口描述"
            hasFeedback>
            <Input type="textarea" rows="3" {...descriptionExist}/>
          </FormItem>

          <FormItem
            {...formItemLayout}
            id="uri"
            label="接口地址"
            hasFeedback>
            <Input id="control-input" placeholder="请输入接口uri" {...uriExist} />
          </FormItem>

          <FormItem
            {...formItemLayout}
            id="type"
            label="接口类型">
            <RadioGroup defaultValue="get"  {...getFieldProps('type', {initialValue: 'get'})}>
              <Radio value="get">GET</Radio>
              <Radio value="post">POST</Radio>
              <Radio value="delete">DELETE</Radio>
              <Radio value="put">PUT</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem>
            <ParamBox
              title="请求参数"
              data={this.state.data.reqParams}
              expandedRowKeys={this.state.expandedRowKeys.req}
              onExpandedRowsChange={this.onReqExpandedRowsChange}
              clone={this.clone}
              delete={this.delete}
              showModal={this.showModal}
            />
          </FormItem>

          <FormItem>
            <ParamBox
              title="响应参数"
              data={this.state.data.resParams}
              expandedRowKeys={this.state.expandedRowKeys.res}
              onExpandedRowsChange={this.onResExpandedRowsChange}
              clone={this.clone}
              delete={this.delete}
              showModal={this.showModal}
            />
          </FormItem>
        </Form>
        <ParamModal
          ref="paramModalForm"
          modal={this.state.modal}
          onOk={this.handleOk(this.state.modal.statusCode)}
          onCancel={this.handleCancel}
        />
        <MockModal
          ref="mockModalForm"
          modal={this.state.mock}
          onOk={this.handleRefresh}
          onCancel={this.handleCancel}
        />
        <div className="center-btn">
          <Button icon="check-circle-o" size="large" type="primary"
                  onClick={_.debounce(this.submit, 250)}>确定</Button>
        </div>
      </Spin>
    )
  }
}

InterfaceDetailPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}
InterfaceDetailPage = Form.create()(InterfaceDetailPage);
export default InterfaceDetailPage;