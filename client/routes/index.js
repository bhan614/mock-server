import React, {Component} from 'react';
import {Route, IndexRedirect, IndexRoute} from 'react-router';
import App from '../containers/App';
import Project from '../containers/ProjectPage';
import InterfaceList from '../containers/InterfaceListPage';
import InterfaceDetail from '../containers/InterfaceDetailPage';
import RestoreMockPage from '../containers/RestoreMockPage';

export default (
	<Route path="/" component={App}>
		<IndexRedirect to="index"/>
		<Route path="index" component={Project}/>
		<Route path="interface" component={InterfaceList}/>
		<Route path="interface/detail" component={InterfaceDetail}/>
		<Route path="restore" component={RestoreMockPage}/>
	</Route>
);