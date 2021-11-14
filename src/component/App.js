
import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { VictoryPie, VictoryLabel } from 'victory';
import update from 'immutability-helper';

import { IntlProvider } from "react-intl";
import messages from '../messages';

import { FormattedMessage } from 'react-intl';

import Header  from './Header';
import PageInfo from './Pageinfo';

import './styles/App.scss';

import data_fi from './data/data_fi.json';
import data_en from './data/data_en.json';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            answers: [],
            analysis: [],
            activeQuestion: 0,
            chartData: [{ y: 5 }, { y: 5 }, { y: 5 }, { y: 5 }],
            showSummary: false,
            lang: this.props.lang,
            hideInfo: false
        };

        this.state.data = (this.state.lang === 'en') ? data_en : data_fi

        this.changeLang = this.changeLang.bind(this);
        this.startSurvey = this.startSurvey.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Language selector
    changeLang = (language) => {
      this.setState({ lang : language });

      if(language === 'fi')
          this.setState({ data : data_fi });

      if(language === 'en')
          this.setState({ data :  data_en });
    }

    // Answer selection
    onRadioChange = (e) => {
        if (e.target.dataset.order) {
            var i = parseInt(e.target.dataset.order);
            this.setState(
                update(this.state, {
                    answers: {
                        [i]: {
                            $set: e.target.value
                        }
                    }
            }));
        }
    }

    // Start survey
    startSurvey = () => {
      this.resetSurvey();
      this.setState({
          hideInfo: true
      })

      console.log("hide info:", this.state.hideInfo);

    }

    // Reset and start over
    resetSurvey = () => {
        this.setState({
            answers: [],
            analysis: [],
            activeQuestion: 0,
            chartData: [{ y: 5 }, { y: 5 }, { y: 5 }, { y: 5 }],
            showSummary: false,
            hideInfo: false
        })
    }

    // Summary text
    summaryText = () => {
            return (
                <div className="summaryText">

                    <h2><FormattedMessage id="summary.headline" /></h2>

                    {Object.keys(this.state.analysis).map(analysis => (
                        <div className="div-analysis" key="{this.state.analysis[analysis].headline}">
                            <div>
                                <h5 style={{ backgroundColor: this.state.analysis[analysis].color }} >
                                    <FormattedMessage id="headline[{analysis}]" defaultMessage={this.state.analysis[analysis].headline} />
                                </h5>
                                <p>
                                <span><FormattedMessage id="character" /></span><br />
                                <FormattedMessage id="pros[{analysis}]" defaultMessage={this.state.analysis[analysis].pros} />
                                </p>
                            </div>
                            <p>
                                <span><FormattedMessage id="weaknesses"/></span><br />
                                <FormattedMessage id="cons[{analysis}]" defaultMessage={this.state.analysis[analysis].cons} />
                            </p>
                            <p>
                                <span><FormattedMessage id="tip" /></span><br />
                                <FormattedMessage id="tip[{analysis}]" defaultMessage={this.state.analysis[analysis].tip} />
                            </p>
                            <hr />
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            this.resetSurvey();
                        }}
                        type="button"
                        className="btn btn-danger btn-lg"><FormattedMessage id="btn.reset" />
                    </button>
                </div>
            )
    }

    // Piechart of the summary
    summaryChart = () => {
        return (
            <svg viewBox="0 0 400 400">
                <VictoryPie
                standalone={false}
                width={400} height={400}
                colorScale={[this.state.data.types.red.color,
                  this.state.data.types.green.color,
                  this.state.data.types.blue.color,
                  this.state.data.types.yellow.color]}
                innerRadius={68} labelRadius={150}
                animate={{ duration: 2000, onLoad: { duration: 1000 } }}
                data={this.state.chartData}
                style={{
                    data: {
                        fillOpacity: 0.93
                    },
                    labels: {
                        size: 20,
                        fill: "#4d4d4d"
                    }
                }}
                />
                <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: 100, fill: "#E4952B" }}
                    x={200} y={200}
                />
            </svg>
        )
    }

    onSubmit = (e) => {
        e.preventDefault();

        var numRed = 0;
        var numBlue = 0;
        var numGreen = 0;
        var numYellow = 0;

        // Calculate answers based on colors
        this.state.answers.map((color) => {

            switch (color) {
                case "blue": numBlue++;
                    break;
                case "red": numRed++;
                    break;
                case "green": numGreen++;
                    break;
                case "yellow": numYellow++;
                    break;
                default: break;
            }

            return false;
        });

        // TODO: Better logic for checking all max value types ?
        var analysis = [];
        var summaries = [numRed, numBlue, numGreen, numYellow]
        var max = Math.max(...summaries);
        if (summaries[0] === max) {
            analysis.push(this.state.data.types.red);
        }

        if (summaries[1] === max) {
            analysis.push(this.state.data.types.blue);
        }

        if (summaries[2] === max) {
            analysis.push(this.state.data.types.green);;
        }

        if (summaries[3] === max) {
            analysis.push(this.state.data.types.yellow);
        }
        // -->

        var chartData = [
            { y: numRed, label: (numRed / this.state.data.questions.length * 100).toFixed(2) + "%" },
            { y: numGreen, label: (numGreen / this.state.data.questions.length * 100).toFixed(2) + "%" },
            { y: numBlue, label: (numBlue / this.state.data.questions.length * 100).toFixed(2) + "%" },
            { y: numYellow, label: (numYellow / this.state.data.questions.length * 100).toFixed(2) + "%" }
        ];

        this.setState(() => ({
            showSummary: true,
            analysis: analysis,
        }), () => {
            setTimeout(() => {
                this.setState(() => ({
                    chartData: chartData
                }));
            }, 150);
        });
    }

    // Navigate questions back and forth
    handleNavigate = (goBack) => {
        if (typeof goBack !== "undefined") {
            var direction = (goBack === true) ? this.state.activeQuestion - 1 : this.state.activeQuestion + 1;
            this.setState({
                activeQuestion: direction
            })
        }
    }

    getQuestions = () => {
        var newdata = this.state.data.questions.map((data, index) => {
            if (this.state.activeQuestion === index) {
            return (
                <div key="question-{index+1}">
                    <h4>{data.question}:</h4>
                    <ul>
                        {Object.keys(data.answers).map((answer, i) => (
                            <li key={i}>
                                <label className={this.state.answers[index] === data.answers[answer].color  ? "radio-selected" : ""} >
                                    <span>{answer}</span>

                                    <input
                                        type="radio"
                                        value={data.answers[answer].color}
                                        data-order={index}
                                        checked={this.state.answers[index] === data.answers[answer].color }
                                        onChange={this.onRadioChange}
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                )
            } return ""
        })
        return newdata;
    }

    surveyNavigation = () => {
        return (
            <div>
                <button
                    onClick={() => {
                        this.handleNavigate(true);
                    }}
                    type = "button"
                    disabled = { this.state.activeQuestion < 1 }
                    className="btn btn-warning btn-lg" >
                        <FormattedMessage id="btn.previous" />
                </button>
                <button
                    onClick={() => {
                        this.handleNavigate(false);
                    }}
                    type="button"
                    disabled={(this.state.activeQuestion >= this.state.data.questions.length - 1) || (this.state.activeQuestion >= this.state.answers.length )}
                    className="btn btn-success btn-lg">
                        <FormattedMessage id="btn.next" />
                </button>
                <br />
                {this.state.answers.length === this.state.data.questions.length && (
                    <FormattedMessage id="btn.submit" >
                        {val =>
                            <input type="submit" value={val} className="btn btn-primary btn-lg" />
                        }
                    </FormattedMessage>)
                }
            </div>

        )
    }

    render() {
        return (
            <IntlProvider locale={this.state.lang} key={this.state.lang} messages={messages[this.state.lang]}>
            <div className="App">
                <div className="container">
                    <Header />
                    {this.state.showSummary === false && (
                        <div>
                          {this.state.hideInfo === false && (
                            <PageInfo
                              changeLang={this.changeLang}
                              startSurvey={this.startSurvey}
                            />)}
                            {this.state.hideInfo === true && (
                            <div className="row">
                                <div className="col">
                                    <form onSubmit={this.onSubmit} className="surveyForm">
                                        {this.getQuestions()}
                                        {this.surveyNavigation()}
                                    </form>
                                </div>
                            </div>)}
                        </div>
                    )}
                    <TransitionGroup component={null}>
                    {this.state.showSummary === true && (
                        <CSSTransition classNames="chart" timeout={300}>
                            <div className="row summaryWrapper">
                                    <div className="col-lg-6">
                                    {this.summaryText()}
                                </div>
                                    <div className="col-lg-6">
                                    {this.summaryChart()}
                                </div>
                            </div>
                        </CSSTransition>
                    )}
                    </TransitionGroup>
                </div>
            </div>
            </IntlProvider>
        );
    }
}

export default App;
