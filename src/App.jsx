import React, {Component} from "react";
import './App.css';
import NavigationBar from './Nav/NavigationBar';
import Home from './Pages/Home/Home';
import FetchData from './FetchData/FetchData';

export default class App extends React.Component{
    render(){
        return(
            <div>
                <NavigationBar/>
            </div>
        );
    }
}



