import React, { Component } from 'react'
import { getTicker } from '../api.js'
import './components.css'
import { createNode, add, suggest } from './trie'
import tickerData from '../common_stocks/aggregate.json'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container  from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { cleanup } from '@testing-library/react'




class TickerList extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            newTicker: '',
            currentDisplay: 'price',
            tickerList: [],
            suggestions: []
        }
    }

    componentDidMount() {
        const localtickerList = localStorage.getItem('localTickers')
        const localtickerListObj = JSON.parse(localtickerList)
        if(localtickerListObj) {
            this.setState({
                tickerList: localtickerListObj
            })
        } else return
    }


    handleDisplayChange = e => {
        this.setState({
            currentDisplay: e.target.value
        })
    }


    onChange = (e) => {

        // CREATE TICKER ARRAY FROM JSON DATA

        let tickerArr = []
        for(const ticker of tickerData) {
            tickerArr.push(ticker["Symbol"])
        }

        // const tickerDataDict = {}
        // tickerData.forEach((company) => {
        //     tickerDataDict[company["Symbol"]] = {
        //         symbol: company['Symbol'],
        //         name: company['Name']
        //     }
        // })

        // Commented out above is a working dictionary of ticker items. Decided to to just render simple array for trie  


        // INSTANTIATE ROOT AND POPULATE TRIE TREE

        const root = new createNode(null)

        for(const ticker of tickerArr) {
            add(ticker, 0, root)
        }

        //  CALL SUGGEST() ON INPUT VALUE AND SET SUGGESTION STATE FOR JSX MAP / RENDER

        const str = e.target.value.toUpperCase()
    
        const suggestions = suggest(str, 0, root)

        this.setState({
            newTicker: e.target.value,
            suggestions: suggestions.slice(0,10)
        })

        // RESET SUGGESTION ARRAY

        if(str.length === 0){ 
            this.setState({
                suggestions: ''
            })
        } 
    }

    onSubmit = async (e) => {   
        e.preventDefault()
        const newestTicker = await getTicker(this.state.newTicker)
        const tickerList = Object.entries(this.state.tickerList)

        const containsTicker = (submittedTicker) => {
            for(let i = 0; i < tickerList.length; i++) {
                if(tickerList[i][1]["ticker"] === submittedTicker) {
                    return true
                }
            }
            return false
        } 

        // I should consider making use of forEach in containsTicker instead of a for loop.
        // I should also consider cleaning up the logic of below for. Namely newestTicker["ticker"]. 

        if(newestTicker["ticker"] === undefined) {
            alert("Please enter a valid ticker")
        } else if(containsTicker(newestTicker["ticker"])) { 
            alert("That ticker is already in your list")
        } else {
                this.setState({
                    tickerList: [...this.state.tickerList, newestTicker],
                    suggestions: '',
                    newTicker: ''
                    })
                localStorage.setItem('localTickers', JSON.stringify(this.state.tickerList))   
            }
    }

    // Below is the suggestion box submit logic, needs cleaning / condesing from the above 

    suggestionSubmit = async (e) => {
        const clickedSuggestion = e.target.textContent       
        const newestTicker = await getTicker(clickedSuggestion)
        const tickerList = this.state.tickerList
        const containsTickerv2 = (submittedTicker) => {
            for(let i = 0; i < tickerList.length; i++) {
                if(tickerList[i]["ticker"] === clickedSuggestion) {
                    return true
                }
            }
            return false
        } 

        if(clickedSuggestion === undefined) {
            alert("Please enter a valid ticker")
        } else if (containsTickerv2(clickedSuggestion)) {
            alert("That ticker is already in your list")
        } else {
            this.setState({
                tickerList: [...this.state.tickerList, newestTicker],
                suggestions: '',
                newTicker: ''
                })
            localStorage.setItem('localTickers', JSON.stringify(this.state.tickerList))  
        }    
    }


    setActive = (ticker) => {
        return () => this.props.setActiveTicker(ticker)
    }

    // I should rewrite the removeTicker() fuction with forEach() or filter() ... the for loop and .push() usage is just sad. 

    removeTicker = (itemToBeRemoved) => {
        return () => {
            const newState = []
            function iterate(prevState) {
                for(let i = 0; i <prevState.length; i++) {
                    if(prevState[i]["ticker"] !== itemToBeRemoved) {
                        newState.push(prevState[i])
                    } 
                }
                return newState
            }

            iterate(this.state.tickerList)

            this.setState({
                tickerList: newState
            })
            localStorage.setItem('localTickers', JSON.stringify(newState))
        }
    }
    
    render() {

        const tickerList = this.state.tickerList
        const suggestions = this.state.suggestions

   
        const suggestionMap = suggestions === '' ? null : suggestions.map((suggestion) => {
            return <div className="suggestion-row-item" key={suggestion} value={suggestion} onClick={this.suggestionSubmit}>{suggestion}</div>
        })

        
        const tickerMap = tickerList.map((item) => {
            let value = item.price
            if(this.state.currentDisplay === "percentChange") {
                value = Math.sign(item.changePercent.slice(0,item.changePercent.length - 1)) === 1 ? '+' + item.changePercent : item.changePercent   
            }
            return <Container key={item.ticker}>
                        <Row>  
                            <Col className="ticker-row" onClick={this.setActive(item.ticker)} > 
                                <span className="ticker-name float-left"> {item.ticker} </span> 
                                <span className="float-right">  {value} </span> 
                            </Col>
                            <Col xs={1}> 
                                <button className="remove-ticker-btns" onClick={this.removeTicker(item.ticker)}>x</button>
                            </Col>
                        </Row> 
                    </Container>
             
        })
    
        const addTickerForm =   <div>
                                        <form onSubmit = {this.onSubmit}> 
                                            <input  id="submit-form"
                                                    type="text" 
                                                    value={this.state.newTicker} 
                                                    placeholder="Add Ticker..." 
                                                    autoComplete="off" 
                                                    onChange={this.onChange} 
                                                    required/> 
                                            {/* <input id="submit-btn" type="submit" value="submit" /> */}
                                        </form>
                                </div>

        const toggles = <div> 
                            <button className="ticker-btns" value="price" onClick={this.handleDisplayChange}> Price </button>
                            <button className="ticker-btns" value="percentChange" onClick={this.handleDisplayChange}> Percent </button>
                        </div> 


        return  <div className="content-container" id="ticker" >

                        <h5>Stocks</h5>

                        <div className ="ticker-map-container"> 
                            <Container>
                                {tickerMap} 
                            </Container>
                        </div>

                        <Container className="add-ticker-row d-flex justify-content-center">
                            <Row> 
                                <Col> 

                                    {addTickerForm}

                                    <div className="suggestion-box">

                                            {suggestionMap}
                                      
                                    </div>
                                </Col>

                                <Col> 
                                    {toggles}
                                </Col>
                            </Row>
                        </Container>
                    </div>

    }
}

export default TickerList