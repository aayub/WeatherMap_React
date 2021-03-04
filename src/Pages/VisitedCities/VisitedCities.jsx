import React, {Component} from "react";
import View from "./../ShowResults/View";
import {Pagination} from 'react-bootstrap';
import {Row, Card, Order} from 'react-bootstrap';
import './VisitedCities.css';

export default class VisitedCities extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cities: [],
            count: 0,
            currentPage: 1,
            recordsPerPage: 3,
        }
        this.setData = this.setData.bind(this);
    }

    setData(){
       this.setState({
           cities: this.props.cities,
           count: this.props.count
       }) 
    }

    handlePageClick(event){
        this.setState({
            currentPage: Number(event.target.id)
        })
    }

    componentDidMount(){
        this.setData();
    }

    componentDidUpdate(newProps){
        if(newProps.cities != this.props.cities){
            console.log("UPDATED ***VISITED");
            this.setData();
        }
    }

    render(){
        const {recordsPerPage, cities, count, currentPage } = this.state;
        const lI = currentPage*recordsPerPage;
        const fI = lI - recordsPerPage;
        var currenResponse = "";
        this.currentResponse = cities.slice(fI,lI);

        const renderWeather = this.currentResponse.map((value,index) => (
            <View data={value} alert={false}/>
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
                <h1>Visited Cities</h1>
                <Pagination className="paginate"> 
                    {renderPageNum}
                </Pagination>
                    {
                        this.props.count > 1 ?
                            <Row className="row">
                            {renderWeather}
                            </Row>
                        :
                        "Error: No matching results found"
                    }
            </div>
        );
    }
    
}