import React, { Component } from 'react'
import { overviewData } from "../api.js"
import './components.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container  from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export class FinancialRatios extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDisplay: "showingEditActive", //showingActive || showingEditActive
            ratioList: {
                "MarketCapitalization": false,
                "EBITDA": false,
                "PERatio": false,
                "PEGRatio": false,
                "BookValue": false,
                "DividendPerShare": false,
                "DividendYield": false,
                "EPS": false,
                "RevenuePerShareTTM": false,
                "ProfitMargin": false,
                "OperatingMarginTTM": false,
                "ReturnOnAssetsTTM": false,
                "ReturnOnEquityTTM": false,
                "RevenueTTM": false,
                "GrossProfitTTM": false,
                "DilutedEPSTTM": false,
                "QuarterlyEarningsGrowthYOY": false,
                "QuarterlyRevenueGrowthYOY": false,
                "AnalystTargetPrice": false,
                "TrailingPE": false,
                "ForwardPE": false,
                "PriceToSalesRatioTTM": false,
                "PriceToBookRatio": false,
                "EVToRevenue": false,
                "EVToEBITDA": false,
                "Beta": false,
                "52WeekHigh": false,
                "52WeekLow": false,
                "50DayMovingAverage": false,
                "200DayMovingAverage": false,
                "SharesOutstanding": false,
                "SharesFloat": false,
                "SharesShort": false,
                "SharesShortPriorMonth": false,
                "ShortRatio": false,
                "ShortPercentOutstanding": false,
                "ShortPercentFloat": false,
                "PercentInsiders": false,
                "PercentInstitutions": false,
                "ForwardAnnualDividendRate": false,
                "ForwardAnnualDividendYield": false,
                "PayoutRatio": false
            },
            data: {}
        }
    }   

    componentDidMount(){
        const localRatiosList = localStorage.getItem('localRatios')
        const localRatiosListObj = JSON.parse(localRatiosList)
        if(!localRatiosListObj) {
            return
        } else {
            this.setState({
                ratioList: localRatiosListObj
            }) 
        }
    }


    onChange = (ratioKey) => {
        return () => {
            this.setState({
                ratioList: {...this.state.ratioList, [ratioKey]: !this.state.ratioList[ratioKey]}
            })
        }
    }


    async componentDidUpdate(prevProps) {
        if(prevProps.activeTicker !==  this.props.activeTicker) {
            this.setState({
                data: await overviewData(this.props.activeTicker)   
            })
        }
        localStorage.setItem('localRatios', JSON.stringify(this.state.ratioList))
    }

    showActive = () => {
        if(this.state.currentDisplay === "showingActive") return 
        else {
            const localRatiosList = localStorage.getItem('localRatios')
            const localRatiosListObj = JSON.parse(localRatiosList)
            if(localRatiosListObj) {
                this.setState({
                    currentDisplay: "showingActive",
                    ratioList: localRatiosListObj
                })
            } else {
                this.setState({
                    currentDisplay: "showingActive"
                })
            }
        }
    }
   

    showEditActive = () => {
        if(this.state.currentDisplay === "showingEditActive") return 
        else {
            this.setState({
                currentDisplay: "showingEditActive"
            })
        }
    }

   
    
    render() {
     
        console.log(this.state.ratioList)
        const currentDisplay = this.state.currentDisplay
        const ratioData = []
        const checkBoxes = []

    


        const currentDisplayFunc = () => {
            if (currentDisplay === "showingActive") {
                return ratioData
            } else {    
                return checkBoxes
            }
        }
      

        for (const [key, value] of Object.entries(this.state.ratioList)){
            
            checkBoxes.push(<div key={key}> 
                <label> 
                    <input type="checkbox" value={value} checked={value} onChange={this.onChange(key)} /> {key}  
                </label>  
            </div>) 

            if(!value) continue 
            let dataValue = "N/A"
            if(this.state.data.hasOwnProperty(key)) {
                dataValue = this.state.data[key] 
            }
            ratioData.push ( 
                            <Container className="ratio-row-item" key={key}> 
                                <Row> 
                                    <Col className="p-0"> 
                                        <span className="ratio-type float-left"> {key} </span> 
                                    </Col> 
                                    
                                    <Col className="p-0">
                                        <span className="ratio-value float-right"> {dataValue} </span> 
                                    </Col>
                                </Row> 
                            </Container>    
                                )
            }   

           

        return (
            <div className="content-container" id="ratios">

                    <h5> Financial Ratios </h5> 

                    <div className="ratio-list-container text-align">
                      
                        <Container> 
                            {currentDisplayFunc()}
                        </Container>
                        
                    </div>

                <Container className="ratio-btn-container d-flex justify-content-center">
                    <Row> 
                        <Col> 
                            <button className="ratio-btns" onClick={this.showActive} > Show Active </button>
                        </Col>

                        <Col> 
                            <button className="ratio-btns" onClick={this.showEditActive}> Edit Active </button>
                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }
}

export default FinancialRatios