import React from 'react';
import {mount} from 'enzyme';
import Field from './Field';

jest.mock('mobx-react', () => ({
	observer: (fn) => () => fn
}));


xdescribe('<Field />', () => {
	const controlFn = () => (<div />);
	const fieldName = 'fieldName';
	const fieldClassName = 'field-class-name';
	let wrapper;
	let control;

	beforeEach(() => {
		control = {
			value: '',
			options: {
				isAsyncValidatingInProgress: false
			},
			asyncValidators: [
				() => {
				}
			],
			transform: v => v
		};

		wrapper = mount(<Field className={fieldClassName} control={controlFn} name={fieldName} />, {
			context: {
				store: {
					ctrls: {
						[fieldName]: control
					},
					validateCtrl: jest.fn(),
					asyncValidateCtrl: jest.fn(),
				}
			}
		});
	});

	it('should be able to getCtrl with appropriate control', () => {
		expect(wrapper.instance().getCtrl()).toEqual(control);
	});

	xit(`should be able to assign className="${fieldClassName}"`, () => {
		expect(wrapper.hasClass(fieldClassName)).toBeTruthy();
	});
});
