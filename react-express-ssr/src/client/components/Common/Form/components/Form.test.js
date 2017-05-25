import React from 'react';
import Form from './Form';
import {mount} from 'enzyme';

describe('<Form />', () => {
	let wrapper;
	const storeObj = {
		prop1: 'data'
	};
	const formClassName = 'form-class-name';

	beforeEach(() => {
		wrapper = mount(
			<Form store={storeObj} className={formClassName}>
				<div></div>
			</Form>);
	});

	it('should be able to getChildContext with appropriate store', () => {
		expect(wrapper.instance().getChildContext()).toEqual({
			store: storeObj
		});
	});

	it(`should be able to assign className="${formClassName}"`, () => {
		expect(wrapper.hasClass(formClassName)).toBeTruthy();
	});
});
