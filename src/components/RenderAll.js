import React, { Component } from 'react'
import TickerList from './TickerList'
import FinancialRatios from './FinancialRatios'
import Graph from './Graph'
import NewsAPI from './/NewsAPI'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container  from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class RenderAll extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      activeTicker: this.props.activeTicker
    }
  }

    setActiveTicker = (ticker) => {
    this.setState({
      activeTicker: ticker
    })
  }

  render() {
    return (
          <Container fluid className="m-0">
            {/* COLUMN 1 */}
            <Row> 
              <Col xl={4} lg={6} md={12} xs={12} className="m-0">
                  <Row className="m-0">
                        <TickerList activeTicker = {this.state.activeTicker}
                                    setActiveTicker = {this.setActiveTicker} /> 
                  </Row>
                  {/* ROW SPLIT */}
                  <Row className="m-0"> 
                    <Graph activeTicker = {this.state.activeTicker} />
                  </Row>
                </Col>
                {/* COLUMN 2 */}
                <Col xl={4} lg={6} md={12} xs={12} className="m-0">
                  <FinancialRatios activeTicker = {this.state.activeTicker} />
                </Col>
                {/* COLUMN 3 */}
                <Col xl={4} lg={12} md={12} xs={12} className="m-0">
                  <NewsAPI activeTicker = {this.state.activeTicker} />
                </Col>
              </Row>
          </Container>
    )
  }
}


export default RenderAll;