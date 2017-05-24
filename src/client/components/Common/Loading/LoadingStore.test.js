import React from 'react';
import LoadingStore from './LoadingStore';

describe('LoadingStore', () => {
	it('should be able to change loading state to true', () => {
		LoadingStore.startLoading();
		expect(LoadingStore.loading).toBeTruthy();
	});

	it('should be able to change loading state from true to false', () => {
		LoadingStore.startLoading();
		expect(LoadingStore.loading).toBeTruthy();
		LoadingStore.stopLoading();
		expect(LoadingStore.loading).toBeFalsy();
	});
});
