import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import './AppReceivedModal.scss';

@inject('modalStore', 'localizationStore')
export default class AppReceivedModal extends Component {
	static propTypes = {
		localizationStore: PropTypes.object.isRequired,
		modalStore: PropTypes.object.isRequired,
		isFullySubmitted: PropTypes.bool
	};

	componentWillMount() {
		this.dictionary = this.props.localizationStore.getPage('AppReceivedModal');
	}

	onClose = () => {
		this.props.modalStore.close();
	};

	render() {
		const {
			descriptions,
			descriptionsWithDocuments,
			buttons
		} = this.dictionary;

		const {isFullySubmitted} = this.props;

		return (
			<div>
				{!isFullySubmitted &&
				<div>
					{descriptions.map(text => <p key={text}>{text}</p>)}
				</div>
				}

				{isFullySubmitted &&
				<div>
					{descriptionsWithDocuments.map(text => <p key={text}>{text}</p>)}
				</div>
				}

				<div className="buttons-group">
					<button
						type="button"
						className="btn btn-primary"
						onClick={this.onClose}>
						{buttons.ok}
					</button>
				</div>
			</div>
		);
	}
}
