import React from 'react';
import MenuSubject from './MenuSubject.js';

export default class Menu extends React.Component {
	constructor(props) {
		super(props);
		var subjects = this.props.menuSubjects
			.map(subject => {return {name: subject, itemsVisible: false}});

			console.log(subjects);

		this.state = {
			subjects: subjects
		};

		this.setItemVisibility = this.setItemVisibility.bind(this);
	};

	renderMenuSubject(id, subject) {
		var menuItems = this.props.images.filter(item => item.type === subject);
		var itemsVisible = this.state.subjects.find(s => s.name === subject).itemsVisible;

		return (<MenuSubject 
				id={id} key={id} subject={subject} onMouseDown={this.props.subjectOnMouseDown} 
				itemOnMouseDown={this.props.itemOnMouseDown} menuItems={menuItems} itemsVisible={itemsVisible} 
				setItemVisibility={s => this.setItemVisibility(s)} />
			);
	};

	setItemVisibility(subject) {
		var newSubjects = this.state.subjects;
		newSubjects.map(s => {s. itemsVisible = false; return s; });
		if(subject !== "") {
			newSubjects.find(s => s.name === subject).itemsVisible = true;
		}

		this.setState({subjects: newSubjects});
	};

	render() {
		var subjects = this.props.menuSubjects
			.map((subject, index) => this.renderMenuSubject(index, subject));

		return (
			<div className="menu">
				{subjects}
			</div>
		)
	}
}