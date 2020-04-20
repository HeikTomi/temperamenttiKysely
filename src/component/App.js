import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { VictoryPie, VictoryLabel } from 'victory';
import update from 'immutability-helper';
import './styles/App.scss';
import data from './data/data.json'

class App extends Component {

    constructor() {
        super();

        this.state = {
            answers: [],
            activeQuestion: 0,
            chartData: [{ y: 5 }, { y: 5 }, { y: 5 }, { y: 5 }],
            summaryColor: "",
            summaryText: "",
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

                    <h2>Olet väriltäsi {this.state.summaryColor}</h2>

                    {this.state.summaryText.map(analysis => (
                        <p>
                            {analysis}
                        </p>
                    ))}

                    <button
                        onClick={() => {
                            this.resetSurvey();
                        }}
                        id="resetBtn"
                        type="button"
                        className="btn btn-danger"> Aloita alusta
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
                        fill: "#4d4d4d",
                        backgroundColor: "#000"
                    }
                }}
                />
                <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: 100, fill: "#E4952B" }}
                    x={200} y={200}
                    text={'\u2606'}
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

        var color = "";
        var colorText = [];
        var summaries = [numRed, numBlue, numGreen, numYellow]
        var max = Math.max(...summaries);

        if (summaries[0] === max) {
            colorText.push(data.types.red);
            color = "Punainen";
        }

        if (summaries[1] === max) {
            if (colorText.length > 0 && color.length > 0 ) {
                color = color + ", ";
            }
            colorText.push(data.types.blue);
            color = color + "Sininen";
        }

        if (summaries[2] === max) {
            if (colorText.length > 0 && color.length > 0) {
                color = color + ", ";
            }
            colorText.push(data.types.green);
            color = color + "Vihreä";
        }

        if (summaries[3] === max) {
            if (colorText.length > 0 && color.length > 0) {
                color = color + ", ";
            }
            colorText.push(data.types.yellow);
            color = color + "Keltainen";
        }

        var chartData = [
            { y: numRed, label: (numRed / data.questions.length * 100).toFixed(2) + "%" },
            { y: numGreen, label: (numGreen / data.questions.length * 100).toFixed(2) + "%" },
            { y: numBlue, label: (numBlue / data.questions.length * 100).toFixed(2) + "%" },
            { y: numYellow, label: (numYellow / data.questions.length * 100).toFixed(2) + "%" }
        ];

        this.setState(() => ({
            showSummary: true,
            summaryColor: color,
            summaryText: colorText,
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
                    className = "btn btn-warning" > Edellinen
                </button>
                <button
                    onClick={() => {
                        this.handleNavigate(false);
                    }}
                    type="button"
                    disabled={this.state.activeQuestion >= data.questions.length - 1}
                    className="btn btn-success"> Seuraava
                </button>
                <br />
                {this.state.answers.length === data.questions.length && (
                    <input className="btn btn-primary" type="submit" value="Näytä tulokseni" /> ) 
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
                            <h1>21 kysymystä persoonallisuudestasi</h1>
                        </div>
                    </div>
                        {this.state.showSummary === false && (
                            <div>
                                <div className="row">
                                    <div className="col">
                                        <p>
                                            Allaoleva testi on kysely, jonka avulla saat alustavan käsityksen omasta temperamentistasi.
                                            Valitse se vaihtoehto, joka kuvastaa itseäsi parhaiten juuri nyt.
			                            </p>
                                        <p>
                                            Persoonallisuutesi kokonaisuus selviää tutkimalla, keskustelemalla, pohtimalla ja ennen kaikkea elämällä
                                            – testi tai kysely toimii aina vain itsetuntemuksen ja ihmistuntemuksen apuvälineenä.
                                            Muista: temperamentti on vain yksi ulottuvuus ihmisen laajassa ja moniulotteisesta persoonallisuudesta.
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
                                    <div className="col-lg-6 chart">
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