import React, { Component } from 'react'
import { newsAPI } from '../api'
import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container  from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export class NewsAPI extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            newsList:[]
        }
    }
    
   async componentDidMount(){
        if(this.props.activeTicker === undefined) {
            return
        } else {
            this.updateLinks()
        }
    }
 
 
    updateLinks = async () => {
        if(this.props.activeTicker === null || this.props.activeTicker === undefined) {
            return
        } else {
          
            const data = await newsAPI(this.props.activeTicker)
           
            const articleDict = {}
            data.articles.forEach((article) => {
                articleDict[article.publishedAt] = {
                    publisher: article.source.name, 
                    title: article.title,
                    url: article.url,
                    imgURL: article.urlToImage,
                    publishDate: article.publishedAt.slice(0, 10)  
                }
            })
    
            const ordered = {}
            Object.keys(articleDict).sort().forEach(function(key){
                ordered[key] = articleDict[key]
            })
            
            const numbOfArticles = 10

            this.setState({
                newsList: Object.values(ordered).slice(10, 10 + numbOfArticles).reverse() 
                // in the above set state, reverse method creates descending order of of articles (most recent first)
                // and the slice method slices out the oldest 10 articles from the api, leaving only the newest 20. 
                // It's worth mentioning that the API sends articles in batches of 20, hence the 10/10 split. 
            })
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.activeTicker === undefined) {
            return
        } else if(prevProps.activeTicker != this.props.activeTicker){
            this.updateLinks()
        }
    }


    render() {

        const newsList = this.state.newsList
        
        const newsListMap = newsList.map((item) => {

            const img = <img src={item.imgURL} height="50" width="50" style={{objectFit:"cover"}} />

            const columnOneItems =   
                                    <Container>
                                        <Row id="news-publishers">  {item.publisher}       </Row> 
                                        <Row id="news-publish-date">  {item.publishDate}   </Row> 
                                        <Row id="news-title">         {item.title}         </Row>
                                    </Container> 

            const columnTwoItems = <div> 
                                        {img}
                                    </div>
            

            const format = 
                    <div className="news-row-item" key={item.url}> 
                        <a href={item.url} target ="_blank" /* style={{textDecoration:"none"}}*/ >
                            <Row>  
                                <Col xl={10} lg={10} md={10} xs={10} >
                                    {columnOneItems}
                                </Col>

                                <Col xl={2} lg={2} md={2} xs={2} className="d-flex align-items-center justify-content-center">
                                    {columnTwoItems}
                                </Col>
                            </Row>
                        </a>
                    </div>    

            return format 
        })

        const newsBanner = () => {
            if(this.props.activeTicker === null || this.props.activeTicker === undefined) {
                return <h5> Select ticker for news </h5>
            } else {
                return <h5> News for {this.props.activeTicker} </h5>
            }
        }

        return (
            <div className="content-container" id="news">

            <div> {newsBanner()} </div>

            <Container className="news-container"> 

                {/* {newsListMap} */}
                <p>
                    Unfortunately News API only enables CORS for localhost when using the free, developer model as I am, 
                    thus I cannot dynamically display news articles via this github deployment (unless I pay $500/month). 
                    Please view the source code and / or refer to the portfolio section of my personal website for a video demonstrating the News API as intended :-) 
                    <br></br>
                    <br></br>
                    <a href="https://www.jaredricardo.io" target="_blank"> Jaredricardo.io </a>
                </p>
            
            </Container>
             
            </div>
        )
    }
}

export default NewsAPI



// api key : 7339cb8efbde43e7b74b3a32535367a7

