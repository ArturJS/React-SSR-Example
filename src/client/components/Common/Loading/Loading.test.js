import React from 'react';
import Loading from './Loading';
import {mount} from 'enzyme';

describe('<Loading/>', () => {
	let wrapper;
	const loadingStore = {
		loading: false
	};

	it('shouldn\'t be render loading indicator', () => {
		wrapper = mountWrapper();
		expect($loading().length).toEqual(0);
	});

	it('should be render loading indicator', () => {
		loadingStore.loading = true;
		wrapper = mountWrapper();
		expect($loading().length).toEqual(1);
	});

	function $loading() {
		return wrapper.find('.loading-screen');
	}

	function mountWrapper() {
		return mount(
			<Loading loadingStore={loadingStore}/>
		);
	}
});
