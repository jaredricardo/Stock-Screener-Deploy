
export async function getTicker(ticker) {
    const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + ticker + '&apikey=TDYHB4DGZLP62GJE&datatype=json'
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-Type':'application/json',
        }
    })
    const data = await result.json()
    return {
        ticker: data["Global Quote"]["01. symbol"],
        price: '$' + data["Global Quote"]["05. price"],
        volume: data["Global Quote"]["06. volume"],
        lastTradingDate: data["Global Quote"]["07. latest trading day"],
        changePercent:  data["Global Quote"]["10. change percent"]
    }
} 

export async function overviewData(ticker) {
    const url = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + ticker + '&apikey=TDYHB4DGZLP62GJE&datatype=json'
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-Type':'application/json',
        }
    })
   return await result.json()

}

export async function dailyData(ticker) {
    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + ticker + '&interval=5min&apikey=TDYHB4DGZLP62GJE&datatype=json'
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-Type':'application/json',
        }
    }) 
   return await result.json()
}

export async function historicalDataThirty(ticker) {
    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker + '&apikey=TDYHB4DGZLP62GJE&datatype=json'
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-Type':'application/json',
        }
    }) 
   return await result.json()

}

export async function historicalDataNinety(ticker) {
    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker + '&outputsize=full&apikey=TDYHB4DGZLP62GJE&datatype=json'
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-Type':'application/json',
        }
    }) 
   return await result.json()
}


export async function newsAPI(ticker) {
    const url = 'https://newsapi.org/v2/everything?' +'q=' + ticker + '&' + 'sortyBy=popularity' + '&' + 'apiKey=7339cb8efbde43e7b74b3a32535367a7'
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
        }
    }) 
   return await result.json()
}