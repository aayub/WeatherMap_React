import View from './View';
import React, {Component} from 'react';
import {Row, Card, Order} from 'react-bootstrap';
import moment from 'moment';
import {slice} from 'lodash/slice';
import {Pagination} from 'react-bootstrap';
import { id } from 'date-fns/esm/locale';

const _ = require('lodash');

// expanded on function from: https://gist.github.com/felipeskroski/8aec22f01dabdbf8fb6b
function convertToWindDir(deg){
    if (deg>11.25 && deg<=33.75){
        return "NNE North-northeast";
      }else if (deg>33.75 && deg<=56.25){
        return "ENE East-northeast";
      }else if (deg>56.25 && deg<=78.75){
        return "E East";
      }else if (deg>78.75 && deg<=101.25){
        return "ESE East-southeast";
      }else if (deg>101.25 && deg<=123.75){
        return "ESE East-southeast";
      }else if (deg>123.75 && deg<=146.25){
        return "SE South-east";
      }else if (deg>146.25 && deg<=168.75){
        return "SSE South-southeast";
      }else if (deg>168.75 && deg<=191.25){
        return "S South";
      }else if (deg>191.25 && deg<=213.75){
        return "SSW South-southeast";
      }else if (deg>213.75 && deg<=236.25){
        return "SW South-west";
      }else if (deg>236.25 && deg<=258.75){
        return "WSW West-southwest";
      }else if (deg>258.75 && deg<=281.25){
        return "W West";
      }else if (deg>281.25 && deg<=303.75){
        return "WNW West-northwest";
      }else if (deg>303.75 && deg<=326.25){
        return "NW North-west";
      }else if (deg>326.25 && deg<=348.75){
        return "NNW North-northwest";
      }else{
        return "N North"; 
      }
}

export default class SearchResults extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            responses: [],
            count: 0,
            currentPage: 1,
            recordsPerPage: 3,
            visitedCities: [],
            visitedCount: 0,
        }
        this.mapResponse = this.mapResponse.bind(this);
        this.setData = this.setData.bind(this);
        this.handleVerifyInVisited = this.handleVerifyInVisited.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleToggleDetailsFromSearchResults = this.handleToggleDetailsFromSearchResults.bind(this);
    }

    handlePageClick(event){
        this.setState({
            currentPage: Number(event.target.id)
        })
    }

    mapResponse(){
        var allResp = [];
        this.props.responses.forEach(data => {

            let format_sunset = moment.unix(data.sys.sunrise).format("hh:mm A");
            let format_sunrise = moment.unix(data.sys.sunset).format("hh:mm A");
            let format_icon = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png";
            let format_flag = "http://openweathermap.org/images/flags/" + data.sys.country.toLowerCase() + ".png";
            let format_winddir = convertToWindDir(data.wind.deg);

            let tmpResp = {
                name: data.name,
                country: data.sys.country,
                sunrise: format_sunrise,
                sunset: format_sunset,
                windspeed: data.wind.speed,
                winddeg: data.wind.deg,
                winddir: format_winddir,
                lat: data.coord.lat,
                long: data.coord.lon,
                feelslike: Number(data.main.feels_like).toFixed(2),
                pressure: data.main.pressure,
                humidity: data.main.humidity,
                temp: data.main.temp,
                mintemp: Number(data.main.temp_min).toFixed(2),
                maxtemp: Number(data.main.temp_max).toFixed(2),
                desc: data.weather[0].description,
                maindesc: data.weather[0].main,
                icon: format_icon,
                flag: format_flag
            }
            allResp.push(tmpResp);
        })
        this.setState({responses: allResp, count: allResp.length},
        );
    }
  
    setData(){
        this.setState({
            responses: this.props.responses,
            count: this.props.count
        })
    }

    handleVerifyInVisited(data){
      // returns true if item has already been visited
      if(this.state.visitedCount >= 0){
        return this.state.visitedCities.some((item) => {
          if(data === item){
            //console.log("this:" + data.feels_like);
            //console.log("prev:" + item.feels_like);
            //console.log("same");
            return true;
          }
        }
        );
      } else {
        return false;
      }
    }

    handleToggleDetailsFromSearchResults(data){
      console.log("called in search results");

      if(this.state.visitedCount == 0){
        this.setState(prevState => ({
          visitedCities: [...prevState.visitedCities, data],
          visitedCount: prevState.visitedCount+1,
        }))
      } else {
        if(this.handleVerifyInVisited(data) == false){
          this.setState(prevState => ({
            visitedCities: [...prevState.visitedCities, data],
            visitedCount: prevState.visitedCount+1,
          }),
          () => {
            this.props.handleToggleDetailsFromHome(data);
          })
        }
      }
    }

    componentDidMount(){
        this.setData();
        this.mapResponse();
    }

    componentDidUpdate(newProps){
        if(newProps.responses != this.props.responses){
            this.setData();
            this.mapResponse();
        }    
    }
   
    render(){
        const {recordsPerPage, responses, current, currentPage, count } = this.state;
        const lI = currentPage*recordsPerPage;
        const fI = lI - recordsPerPage;
        var currenResponse = "";
        this.currentResponse = responses.slice(fI,lI);

        const renderWeather = this.currentResponse.map((value,index) => (
            <View data={value} alert={true} handleToggleDetailsFromSearchResults={this.handleToggleDetailsFromSearchResults}/>
        ));
        
        const pageNums = [];    
        for(let i=1; i <= Math.ceil(count/recordsPerPage); ++i){
            pageNums.push(i);
        } 

        const renderPageNum = pageNums.map(num => {
            return(
                <Pagination.Item className="pagItem" key={num} id={num} onClick={this.handlePageClick}>
                    {num}
                </Pagination.Item>
            );
        });

        return(
            <div className="container m1-3">
                <Pagination className="paginate"> 
                    {renderPageNum}
                </Pagination>
                    {
                        this.state.count > 1 ?
                            <Row className="row">
                            {renderWeather}
                            </Row>
                        :
                        ""
                    }
            </div>
        );
    }

}

