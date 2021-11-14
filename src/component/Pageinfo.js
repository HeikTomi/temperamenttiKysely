
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class PageInfo extends Component {

  render() {
    return (
      <div className="row">
          <div className="col">
            <div className="infoText" >
              <p>
                <FormattedMessage
                    id="homepage.info"
                    values={{
                        newP: <span><br /><br /></span>,
                    }} />
              </p>
                <div className="row">
                  <div className="col-md-6">
                    <button className="btn btn-primary btn-lg" onClick={() => {this.props.startSurvey()}}  >
                      <FormattedMessage id="btn.start" />
                    </button>
                  </div>
                  <div className="col-md-6 order-first order-md-last">
                    <select className="form-select form-select-lg mb-3"
                      onChange={e => {
                          this.props.changeLang(e.target.value);
                      }}>
                      <FormattedMessage id="btn.languageSelector">
                        {(message) => <option value="default"> {message}</option>}
                      </FormattedMessage>
                      <option value="fi">Suomeksi </option>
                      <option value="en">English </option>
                    </select>
                  </div>
                </div>
              </div>
          </div>
      </div>
    )
  }
}

export default PageInfo;
