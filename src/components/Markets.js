import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

function Markets() {
    const [data , setData] = useState([]);
    const [pageNumber , setPageNumber] = useState(0);
    const dataPerPage = 20;
    const pagesVisited = dataPerPage * pageNumber
    const pageCount = Math.ceil(data.length / dataPerPage);
    const ws = new WebSocket("wss://ws.bitpin.ir");
   
    const apiCall = {
        "event": "currency_price_info_update",
        "data": {
            "channel": "order_book_btcusd"
        }
        
      };

    //fetch data
    const getData = () => {
        axios.get("https://api.bitpin.ir/v1/mkt/markets/").then(
            response => {
                setData(response.data.results)
            }
        ).catch(
            error => console.log(error)
        )
    }
    const connectWs = () => {
        ws.onopen = (event) =>{
            ws.send(JSON.stringify(apiCall));

            console.log('connected!!')
            
        }
        ws.onmessage = (event) => {
            const json = JSON.parse(event.data);
            console.log(event.data);
            
        }
        ws.onerror = (event) => {
           
        }
    }
    useEffect(() => {
        getData()
        connectWs()
    } , [])

    // display data func
    const displayData = data.slice(pagesVisited, pagesVisited + dataPerPage)
    .map((item , index) => {
      return (
        <div key={index} className="grid grid-cols-5 gap-1 mb-5 ">
            <div className='flex gap-3 '>
                <img width='20px' height='20px' src={item.currency1.image}/>
                <p className='text-xl'>{item.code}</p>
            </div>
            <p>{item.order_book_info.price}</p>
            <p>{item.order_book_info.min}</p>
            <p>{item.order_book_info.max}</p>
            <p>{item.order_book_info.change}</p>
        </div>
      );
    });

    //onchange page func
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

  return (
    <div className='p-4 px-6 mx-auto '>
        <div className="grid grid-cols-5 gap-1 mb-7 text-lg">
            <p>code</p>
            <p>price</p>
            <p>min</p>
            <p>max</p>
            <p>change</p>
        </div>
        <div>{displayData}</div>
        <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            className="flex gap-3 width-full justify-center"
            activeClassName='bg-gray-200 px-4'
      />
    </div>
  )
}

export default Markets