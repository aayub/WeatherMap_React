import React, {Component} from 'react';
import {Row, Card} from 'react-bootstrap';
import {format} from "date-fns";

export default class Result extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            response: undefined,
            loading: false,
            city: undefined,
            country: undefined,
            date: undefined,
            icon: undefined,
            temp: undefined,
            max_temp: undefined,
            min_temp: undefined,
            desc: undefined,
            default: true,
            searched: false
        }
        this.setData = this.setData.bind(this);
    }

    componentDidUpdate(newProps){
        if(newProps.response !== this.props.response)
            this.setData();
    }

    componentDidMount(){
        this.setData();
    }

    setData(){
        console.log("response:" + JSON.stringify(this.props.response));
        if(this.props.response != undefined && this.props.response != []){
            // date conversion
            var toDate = new Date(this.props.response.dt*1000);
            var days = ['Sunday','Monday','Tuesday','Wednesday',
            'Thursday','Friday','Saturday'];
            var DoW = days[toDate.getDay()];
            var dateFormat = format(toDate,"MMMM dd yyyy");
            // icon conversion
            var iconURL = `http://openweathermap.org/img/wn/${this.props.response.weather[0].icon}@4x.png`;
            
            this.setState({
                response: this.props.response,
                city: this.props.response.name,
                country: this.props.response.sys.country,
                date: `${DoW} - ${dateFormat}`,
                icon: iconURL,
                temp: Number((this.props.response.main.temp).toFixed(1)),
                max_temp: Number((this.props.response.main.temp_max).toFixed(1)),
                min_temp: Number((this.props.response.main.temp_min).toFixed(1)),
                desc: this.props.response.weather[0].description,
                default: this.props.default,
                searched: this.props.searched,
                loading: false,
            },
            );
        } else {
            console.log("Loading weather data");
        } 
    }

    render(){
        return(
            <Card className="cardView">
                {this.props.response == undefined || this.props.response == [] ? 
                <Card.Title>Loading...</Card.Title>
                :
                <div>
                <Card.Title className="cityTitle px-2 mt-2">{this.state.city}, {this.state.country}</Card.Title>
                <Card.Text className="date">{this.state.date}</Card.Text>
                <Card.Body>
                <Row className="imgandtemp">
                    <Card.Img className="img" src={this.state.icon}></Card.Img>
                    <Card.Text className="temp">{this.state.temp} &deg;C </Card.Text>
                </Row>
                <Card.Text className="conditions">{this.state.desc}</Card.Text>
                <Row className="lowandhightemp">
                    <Card.Text><span id="tmp">Low:</span> {this.state.min_temp} &deg;C</Card.Text>
                    <Card.Text><span id="tmp">High:</span> {this.state.max_temp} &deg;C</Card.Text>
                </Row>
                </Card.Body>
                </div>}
            </Card>
            
        );
    }

}