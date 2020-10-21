import React, { Component } from 'react'
import { dailyData } from '../api'
import { historicalDataThirty } from '../api'
import { historicalDataNinety} from '../api'
import { Line } from 'react-chartjs-2'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container  from 'react-bootstrap/Container'


function newChartConfig(labels, data, activeTicker, graphedDaysFunc) {
    return {
        labels: labels, 
        datasets: [
          {
            label: graphedDaysFunc,
            fill: false,
            lineTension: 0,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: '#58c43b',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'white',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data
          }
        ] 
    }
}

export class Graph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graphedDays: 30, //initial state is 30 day graph 
            dataPointsNeeded: null,
            dailyXData: null,
            monthlyXData: null,
            threeMonthXData: null,
            dailyYData: null,
            monthlyYData: null,
            threeMonthYData: null
        }
    }


    clickHandlers = (e) => {
        if (this.props.activeTicker === undefined) {
            alert("No active ticker selected. Please choose a ticker from your ticker list.")
        } else if(e.target.value === "one") {
            return this.handleClickDaily()
        } else if (e.target.value === "thirty") {
            return this.handleClickThirty()
        } else if(e.target.value === "ninety") {
           return this.handleClickNinety()
        }
    }

    handleClickDaily = async () => {
        this.setState({
            graphedDays:1,
            dataPointsNeeded: 100 
        }) 
    }
    handleClickThirty = async () => {

        this.setState({
            graphedDays: 30,
            dataPointsNeeded: 90
        })
    }
    handleClickNinety = async () => {
        this.setState({
            graphedDays: 90 ,
            dataPointsNeeded: 90
        })
    }


    updateData = async (refresh) => {
        if (this.props.activeTicker === undefined) return // same as return null 
        
        if(this.state.graphedDays === 1 ) {

            if(this.state.dailyXData !== null && !refresh) return 

            const data = await dailyData(this.props.activeTicker)
            const parsed = data["Time Series (5min)"]
            const yAxisArr = Object.values(parsed).map((e) => +e["3. low"])
            const dailyDataArr = yAxisArr.splice(0, yAxisArr.length).reverse()
            const dailyxAxisData = Object.keys(parsed).map(e => e.slice(10, parsed.length)).reverse()
            this.setState({
                dailyYData:dailyDataArr,
                dailyXData: dailyxAxisData                
            })
        } else if (this.state.graphedDays === 30) {

            if(this.state.monthlyXData !== null && !refresh) return 

            const data = await historicalDataThirty(this.props.activeTicker)
            const parsed = data["Time Series (Daily)"]
            const yAxisArr = Object.values(parsed).map((e) => +e["4. close"])
            const oneMonthDataPoints = yAxisArr.splice(0, 30).reverse()
            const monthlyxAxisData = Object.keys(parsed).map(e => e.slice(5, parsed.length)).splice(0, 30).reverse()

            this.setState({
                monthlyYData: oneMonthDataPoints,
                monthlyXData: monthlyxAxisData
            })
        } else if (this.state.graphedDays === 90) {

            if(this.state.threeMonthXData !== null && !refresh) return 

            const data = await historicalDataNinety(this.props.activeTicker)
            const parsed = data["Time Series (Daily)"]
            const yAxisArr = Object.values(parsed).map((e) => +e["4. close"])
            const threeMonthDataPoints = yAxisArr.splice(0, 90).reverse()
            const threeMonthxAxisData = Object.keys(parsed).map(e => e.slice(5, parsed.length)).splice(0, 90).reverse()

            this.setState({
                threeMonthYData: threeMonthDataPoints,
                threeMonthXData: threeMonthxAxisData
            })
        }
    }

    async componentDidMount() {
        this.updateData()
    }
    
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeTicker !== this.props.activeTicker || 
            prevState.graphedDays !== this.state.graphedDays) {
            this.updateData(prevProps.activeTicker !== this.props.activeTicker)
        }
    }

    render() {

        const activeTicker = this.props.activeTicker

        let X = this.state.dailyXData
        let Y = this.state.dailyYData

        if(this.state.graphedDays === 30) {
            X = this.state.monthlyXData
            Y = this.state.monthlyYData
        } else if ( this.state.graphedDays === 90) {
            X = this.state.threeMonthXData
            Y = this.state.threeMonthYData
        }
         
        const graphLabel = () => {
            if(this.state.graphedDays === null || this.props.activeTicker === undefined) {
                return "No active ticker"
            } else {
                return activeTicker.toUpperCase() + ' ' + this.state.graphedDays + ' day graph'
            }
        }
       
        const config = newChartConfig(X, Y, activeTicker, graphLabel())
        const options = {
            maintainAspectRatio: false,
            responsive: true
        }

        const graphHeight = 350

        return (
            <div className="content-container" id="graph">

                <Container fluid> 
                        <Line   
                            data=       {config} 
                            options=    {options} 
                            height= {graphHeight}
                        />

                        <div className="graph-btn-container"> 
                            <button className="graph-btns" value="one"      onClick={this.clickHandlers}>1 day</button>
                            <button className="graph-btns" value="thirty"   onClick={this.clickHandlers}> 30 day </button>
                            <button className="graph-btns" value="ninety"   onClick={this.clickHandlers}> 90 day</button>
                        </div>
                </Container>
            </div>
        )
    }
}

export default Graph