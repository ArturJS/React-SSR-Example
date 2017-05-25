import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {Controls} from '../../../../Common/Form/index';
import {LocalizationField} from '../../../../Common/Localization/index';
import './Documents.scss';

@observer
export default class Documents extends Component {
	static contextTypes = {
		store: PropTypes.object,
		localizationDictionary: PropTypes.object
	};

	render() {
		let documents = [];
		const {
			filesDragDropCtrl
		} = Controls;

		for (let documentName in this.context.store.ctrls) {
			if (this.context.store.ctrls[documentName].options && !this.context.store.ctrls[documentName].options.hide) {
				documents.push(
					<div
						key={documentName}
						className="form-group">
						<LocalizationField
							className="control-field file-field"
							name={documentName}
							control={filesDragDropCtrl}
							hideError={true}
							dictionaryName={documentName}>
							<label className="control-label">
								<span
									className="control-label-title">{this.context.localizationDictionary[documentName]}</span>
								{
									this.context.localizationDictionary[`${documentName}SubTitle`] &&
									<span>{this.context.localizationDictionary[`${documentName}SubTitle`]}</span>
								}
							</label>
						</LocalizationField>
					</div>
				);
			}
		}
		return <div className="documents-upload-content">{documents}</div>;
	}
}
