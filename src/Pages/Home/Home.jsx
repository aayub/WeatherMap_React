import React, {Component} from "react";
import Result from './../ShowResults/Result';
import SearchResults from './../ShowResults/SearchResults';
import "./Home.css";
import {Row, Card} from 'react-bootstrap';
import {format} from "date-fns";

export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // default pagination values
            currentPage: 1,
            totalPages: 1,
            // search information
            searched: false,
            default: true,
            allResponses: [],
        }
        this.handleToggleDetailsFromHome = this.handleToggleDetailsFromHome.bind(this);
    }

    setData(){
        this.setState({
            responses: this.props.responses
        })
    }

    handleToggleDetailsFromHome(data){
        console.log("called in home");
        this.props.handleToggleDetailsFromFetch(data);
    }


    componentDidMount(){
        this.setData();
    }

    componentDidUpdate(newProps){
        if(this.props.responsesCount > 0 && newProps.responses != this.props.responses )
            this.setData();
    }

    render(){
        
       if(this.props.responsesCount > 1){
           return(
           <SearchResults
           responses={this.state.responses}
           count={this.state.responsesCount}
           handleToggleDetailsFromHome={this.handleToggleDetailsFromHome}
           />
           );
       } else {
           return(
            <Result response={this.props.defaultLocation}/>
           );
       }
    }

}