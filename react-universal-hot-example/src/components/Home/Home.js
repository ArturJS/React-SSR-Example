import React, { Component } from 'react';
import config from '../../config';
import Helmet from 'react-helmet';
import Counter from '../Counter';
import './Home.scss';

export default class Home extends Component {

  render() {
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    return (
      <div >
        <Helmet title="Home"/>
        <div >
          <div className="container">
            <div >
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>{config.app.title}</h1>

            <h2>{config.app.description}</h2>

            <p>
              <a href="https://github.com/erikras/react-redux-universal-hot-example"
                 target="_blank">
                <i className="fa fa-github"/> View on Github
              </a>
            </p>

            <p >
              Created and maintained by <a href="https://twitter.com/erikras" target="_blank">@erikras</a>.
            </p>
          </div>
        </div>
        <Counter />
        <Counter />
        <Counter />
        <Counter />
        <Counter />

        <div className="container">
          <h3>From the author</h3>

          <p>
            I cobbled this together from a wide variety of similar "starter" repositories. As I post this in June 2015,
            all of these libraries are right at the bleeding edge of web development. They may fall out of fashion as
            quickly as they have come into it, but I personally believe that this stack is the future of web development
            and will survive for several years. I'm building my new projects like this, and I recommend that you do,
            too.
          </p>

          <p>Thanks for taking the time to check this out.</p>

          <p>– Erik Rasmussen</p>
        </div>
      </div>
    );
  }
}
