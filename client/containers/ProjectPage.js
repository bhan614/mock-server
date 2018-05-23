import React, {Component} from 'react';
import { Link, history } from 'react-router';
import $ from 'jquery';
import ProjectList from '../components/project/projectList';
import ProjectModal from '../components/project/ProjectModal';

class ProjectPage extends Component{
	
	render() {
		return (
			<div>
				<ProjectModal title="新建项目" refresh={this.props.refresh}/>
				<ProjectList title="项目列表" projectList={this.props.projectList} refresh={this.props.refresh}/>
			</div>
		);
	}
}

export default ProjectPage;