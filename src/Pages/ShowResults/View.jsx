import React, {Component} from 'react';
import {Card, Row, Image, Accordion, Button} from 'react-bootstrap';
import './View.css';

export default class View extends React.Component {

    constructor(props){
        super(props);
        this.handleToggleDetailsFromView = this.handleToggleDetailsFromView.bind(this);
    }

    handleToggleDetailsFromView(){
        console.log("called in view");
        if(this.props.alert == true)
            this.props.handleToggleDetailsFromSearchResults(this.props.data);
    }

    render(){
        return(
            <Card className="card">
                    <Image className="iconimg"src={this.props.data.icon}></Image>
                    <Card.Text className="deg">{this.props.data.temp} &deg;C</Card.Text>
                <Card.Title className="title">
                {this.props.data.name}
                <Image className="flagimg" src={this.props.data.flag}></Image>
                {this.props.data.country}
                </Card.Title>
                <Card.Body className="cardbody">
                    <Card.Text className="text">
                        <p><span>Feels like: </span>{this.props.data.feelslike} &deg;C</p>
                        <p>{this.props.data.maindesc} ({this.props.data.desc}.)</p>
                    </Card.Text>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={this.handleToggleDetailsFromView}>
                            <Card.Title>+</Card.Title>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Text className="text">
                                <p>
                                    <span>High: </span>
                                    {this.props.data.mintemp} &deg;C
                                    <br/>
                                    <span> Low: </span>
                                    {this.props.data.maxtemp} &deg;C
                                    <br/>
                                    <span>Sunrise: </span>{this.props.data.sunrise}
                                    <br/>
                                    <span>Sunset: </span>{this.props.data.sunset}
                                    <br/>
                                    <span>Humidity: </span>{this.props.data.humidity}%
                                    <br/>
                                    <span>Pressure: </span>{this.props.data.pressure} hPa
                                    <br/>
                                    <span>Wind: </span>{this.props.data.windspeed} m/s -
                                    <br/>
                                    {this.props.data.winddir}({this.props.data.winddeg})
                                    <br/>
                                    <span>Geo Location: </span>{this.props.data.lat}, {this.props.data.long}
                                </p>
                            </Card.Text>
                        </Accordion.Collapse>
                    </Accordion>
                </Card.Body>
            </Card>
        )
    }
}