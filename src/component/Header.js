
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class Header extends Component {
  render(){
      return (
        <div className="row">
            <div className="col">
                <h1><FormattedMessage id="homepage.headline" /></h1>
            </div>
        </div>
      )
  }
}

export default Header;
