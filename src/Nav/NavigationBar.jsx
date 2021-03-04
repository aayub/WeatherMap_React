import React, {useState} from "react";
import {Navbar, Nav, NavItem, Form, FormControl, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
// router components
import FetchData from './../FetchData/FetchData';
import VisitedCities from '../Pages/VisitedCities/VisitedCities';
import jsonCities from '../city.list.json';
import { isThisSecond } from "date-fns";

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchLocation: {
                searchedBoth: false,
                city: undefined,
                country: undefined,
                ids: [],
                count: 0
            },
            searched: false,
            errormsg: undefined,
            visited: {
                cities: [],
                count: 0
            },
            default: true,
        }
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.handleVisited = this.handleVisited.bind(this);
    }

    handleVisited(data){
        console.log("called here navbar");
        this.setState(prevState => ({
            visited: {
                cities: [...prevState.visited.cities, data],
                count: prevState.visited.count+1,
            }
        }))
        console.log("CNT:" + this.state.visited.count);
        
    }

    onChangeSearch = (event) => {
        // convert to lower case and remove any white spaces
        let value = (event.target.value).toLowerCase();
        value = value.replace(/ /g, '');

        var allowed = 'A-Za-z,';
        function checkAllowedCharacters(str, allowed){
            var pattern = new RegExp('[^'+allowed+']');
            return str.match(pattern) == null;
        }
        
        // allow search -> city name followed by two letter country code
        // thus, determine if search is city+country or just city
        if(checkAllowedCharacters(value, allowed)){
            if(value != ''){
                // includes both city and country
                if(value.includes(',')){
                    var searchArray = value.split(',');
                    this.setState({
                        searchLocation: {
                            searchedBoth: true, city: searchArray[0], country: searchArray[1]
                        },
                        searched: false,
                        default: false
                    });
                }
                // only includes city
                else if(value.includes('')) {
                    this.setState({
                        searchLocation: {
                            searchedBoth: false, city: value
                        },
                        searched: false,
                        default: false
                    });
                }
            }
        } else {
            this.setState({
                errormsg: "Your search input is invalid"
            })
        }
        
    }
    onSubmitSearch = (event) => {
        event.preventDefault();
        var listOfIDs = [];
        var cnt = 0;
        if(this.state.searchLocation.searchedBoth){
            for(let i=0; i < jsonCities.length; ++i){
                if((jsonCities[i].name).toLowerCase() == this.state.searchLocation.city && 
                    (jsonCities[i].country).toLowerCase() == this.state.searchLocation.country){
                        listOfIDs += jsonCities[i].id + ",";
                        cnt++;
                    }
            }
        } else {
            for(let i=0; i < jsonCities.length; ++i){
                if((jsonCities[i].name).toLowerCase() == this.state.searchLocation.city){
                        listOfIDs += jsonCities[i].id + ",";
                        cnt++;
                    }
            }
        }
       // console.log("CHECK FROM NAVIGATION BAR: " + listOfIDs);
        this.setState({
            searchLocation: { 
                ids: listOfIDs,
                count: cnt
            },
            searched: true
        })
    };

    render(){
        return(
        <Router>
        <Navbar sticky="top" bg="dark" variant="dark">
            <Nav className="mr-auto">
                <NavItem><Nav.Link as={Link} to="/">Home</Nav.Link></NavItem>
                <NavItem><Nav.Link as={Link} to="/visitedcities">Visited City</Nav.Link></NavItem>
            </Nav>
            <Form inline onSubmit={this.onSubmitSearch} value={this.state.searchLocation.ids}>
                <FormControl className="mr-sm-2" type="text" placeholder="Search for your city" onChange={this.onChangeSearch}/>
                <Button variant="danger" type="submit">Search</Button>
            </Form>
        </Navbar>
        <Switch>
            <Route exact path="/" component={() => 
            <FetchData 
            default={this.state.default}
            searched={this.state.searched}
            ids={this.state.searchLocation.ids}
            count={this.state.searchLocation.count}
            errormsg={this.state.errormsg}
            handleVisited={this.handleVisited}
            />}/>
            <Route path="/visitedcities" component={() => 
            <VisitedCities
            cities={this.state.visited.cities}
            count={this.state.visited.count}
            />}/>
        </Switch>
        </Router>
        );
    }
    
}
