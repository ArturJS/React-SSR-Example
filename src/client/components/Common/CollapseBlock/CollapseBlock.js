import React, {Component} from 'react';
import classNames from 'classnames';
import Collapse from 'react-collapse';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import './CollapseBlock.scss';
import PropTypes from 'prop-types';

export default class CollapseBlock extends Component {
	static propTypes = {
		isOpened: PropTypes.bool.isRequired,
		className: PropTypes.string,
		children: PropTypes.any
	};

	render() {
		const {
			isOpened,
			className,
			children
		} = this.props;

		return (
			<Collapse
				isOpened={isOpened}
				className={classNames('collapse-block', {[className]: !!className})}>
				<CSSTransitionGroup
					className="fade-in-out"
					transitionName="fade-in-out"
					transitionEnter={true}
					transitionLeave={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{children}
				</CSSTransitionGroup>
			</Collapse>
		);
	}
}
