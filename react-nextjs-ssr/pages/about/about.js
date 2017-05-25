import React, {Component} from 'react';
import stylesheet from './about.scss';

export default class AboutPage extends Component {
  render() {
    return (
      <div className="about-page">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <h1 className="page-title">About page</h1>
        <p>This is the about page</p>
      </div>
    );
  }
}
