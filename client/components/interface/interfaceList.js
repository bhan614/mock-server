/**
 * 列表组件
 */
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';
import message from 'antd/lib/message';
import Tooltip from 'antd/lib/tooltip'
import React from 'react';
import {Link} from 'react-router';
import $ from 'jquery';


class InterfaceListPage extends React.Component {

    /**
     * 访问删除接口API
     * @param pid 项目ID
     * @param id 接口ID
     */
    delete(pId, id) {
        return () => {
            $.ajax({
                url: '/api/projects/' + pId + '/interfaces/' + id,
                type: 'delete'
            })
                .done((data) => {
                    switch (data.code) {
                        case 0:
                            message.success('删除成功！');
                            this.props.refresh();
                            break;

                        case 1:
                            message.info("您的登陆已经过期啦，打开一个新的页面重新登陆吧~");
                            break;

                        default:
                            message.error(data.msg);
                            break;
                    }
                })
                .fail((err) => {
                    message.error('Ajax请求删除失败！');
                })
        }
    }

    constructor(prop) {
        super(prop);

        this.columns = [{
            title: '序号',
            width: '45px',
            render: (text, record, index) => <span>{index + 1}</span>
        }, {
            title: '接口名',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, record) => <Link
                to={'/interface/detail?projectId=' + record.pId + '&interfaceId=' + record._id}>{record.user ? text + '（'+record.user.fullname+'）' : text}</Link>,
        }, {
            title: '接口地址',
            key: 'uri',
            width: '30%',
            dataIndex: 'uri',
        }, {
            title: '请求类型',
            key: 'type',
            dataIndex: 'type',
            width: '65px',
        }, {
            title: '接口描述',
            key: 'description',
            dataIndex: 'description',
            width: '40%',
            render: (text, record) => <Tooltip title={text} placement="topLeft">
                <div className='ant-table-ellipsis'>{text}</div>
            </Tooltip>
        }, {
            title: '最后更新时间',
            key: 'updatetime',
            dataIndex: 'updatetime',
            width: '150px',
        }, {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: '105px',
            render: (text, record) => (
                <div>
                    <Link className="ant-table-link"
                          to={'/interface/detail?projectId=' + record.pId + '&interfaceId=' + record._id}>查看详情</Link>
                    <Popconfirm title="确定要删除这个项目吗？" onConfirm={this.delete(record.pId, record._id)}>
                        <a className="ant-table-link" href='#'>删除</a>
                    </Popconfirm>
                </div>
            ),
        }];
    }


    render() {

        return (
            <Table rowKey="_id"
                   pagination={false}
                   columns={this.columns}
                   dataSource={this.props.interfaceList}
                   bordered
                   title={() => this.props.title}/>
        )
    }
}
;

export default InterfaceListPage;