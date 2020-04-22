import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { VictoryPie, VictoryLabel } from 'victory';
import update from 'immutability-helper';

import { FormattedMessage } from 'react-intl';

import data from './data/data.json'

import './styles/App.scss';

class App extends Component {

    constructor() {
        super();

        this.state = {
            answers: [],
            analysis: [],
            activeQuestion: 0,
            chartData: [{ y: 5 }, { y: 5 }, { y: 5 }, { y: 5 }],
            showSummary: false
        };

        this.onRadioChange = this.onRadioChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

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

    resetSurvey = () => {
        this.setState({
            answers: [],
            activeQuestion: 0,
            chartData: [{ y: 5 }, { y: 5 }, { y: 5 }, { y: 5 }],
            finalChartData: [],
            summaryColor: "",
            summaryText: [],
            showSummary: false
        })
    }

    summaryText = () => {
            return (
                <div className="summaryText">


                    <h2>Olet väriltäsi: </h2>

                    {Object.keys(this.state.analysis).map(analysis => (
                        <div className="div-analysis">
                            <p>
                                <h5 style={{ backgroundColor: this.state.analysis[analysis].color }} >
                                    <FormattedMessage id="headline[{analysis}]" defaultMessage={this.state.analysis[analysis].headline} />
                                </h5>
                                <span><FormattedMessage id="character" /></span>
                                <FormattedMessage id="pros[{analysis}]" defaultMessage={this.state.analysis[analysis].pros} />
                            </p>
                            <p>
                                <span><FormattedMessage id="weaknesses"/></span>
                                <FormattedMessage id="cons[{analysis}]" defaultMessage={this.state.analysis[analysis].cons} />
                            </p>
                            <p>
                                <span><FormattedMessage id="tip" /></span>
                                <FormattedMessage id="cons[{analysis}]" defaultMessage={this.state.analysis[analysis].tip} />
                            </p>
                            <hr />
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            this.resetSurvey();
                        }}
                        type="button"
                        className="btn btn-danger btn-lg"> Aloita alusta
                    </button>
                </div>
            )
    }

    summaryChart = () => {
        return (
            <svg viewBox="0 0 400 400">
                <VictoryPie
                standalone={false}
                width={400} height={400}
                colorScale={["red", "green", "blue", "yellow"]}
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

        // TODO: Better logic for checking all max value types ?!
        var analysis = [];
        var summaries = [numRed, numBlue, numGreen, numYellow]
        var max = Math.max(...summaries);
        if (summaries[0] === max) {
            analysis.push(data.types.red);
        }

        if (summaries[1] === max) {
            analysis.push(data.types.blue);
        }

        if (summaries[2] === max) {
            analysis.push(data.types.green);;
        }

        if (summaries[3] === max) {
            analysis.push(data.types.yellow);
        }
        // -->

        var chartData = [
            { y: numRed, label: (numRed / data.questions.length * 100).toFixed(2) + "%" },
            { y: numGreen, label: (numGreen / data.questions.length * 100).toFixed(2) + "%" },
            { y: numBlue, label: (numBlue / data.questions.length * 100).toFixed(2) + "%" },
            { y: numYellow, label: (numYellow / data.questions.length * 100).toFixed(2) + "%" }
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
        var newdata = data.questions.map((data, index) => {
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
            }
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
                    className= "btn btn-warning btn-lg" > Edellinen
                </button>
                <button
                    onClick={() => {
                        this.handleNavigate(false);
                    }}
                    type="button"
                    disabled={this.state.activeQuestion >= data.questions.length - 1}
                    className="btn btn-success btn-lg"> Seuraava
                </button>
                <br />
                {this.state.answers.length === data.questions.length && (
                    <input className="btn btn-primary btn-lg" type="submit" value="Näytä tulokseni" /> ) 
                }
            </div>
        )
    }
 
    render() {
        return (
            <div className="App">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1><FormattedMessage id="homepage.headline" /></h1>
                        </div>
                    </div>
                    {this.state.showSummary === false && (
                        <div>
                            <div className="row">
                                <div className="col">
                                    <p>
                                        <FormattedMessage
                                            id="homepage.info"
                                            values={{
                                                newP: <span><br /><br /></span>,
                                            }} />
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <form onSubmit={this.onSubmit} className="surveyForm">
                                        {this.getQuestions()}
                                        {this.surveyNavigation()}
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    <TransitionGroup component={null}>
                    {this.state.showSummary === true && (
                        <CSSTransition classNames="chart" timeout={300}>
                            <div className="row">
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
        );
    }
}

export default App;