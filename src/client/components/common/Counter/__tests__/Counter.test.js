import React from 'react';
import {mount} from 'enzyme';
import Counter from '../Counter';

describe('<Counter />', () => {
  it('<Counter /> component should render whole initial data properly', () => {
    const wrapper = mount(<Counter />);
    expect(wrapper.text()).toBe('Count: 0');
  });

  it('<Counter /> component should increase count number after click', () => {
    const wrapper = mount(<Counter />);
    wrapper.simulate('click');
    expect(wrapper.text()).toBe('Count: 1');
  });
});
