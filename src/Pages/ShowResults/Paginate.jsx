import React, {Component} from 'react';
import {Pagination} from 'react-bootstrap';

export default class Paginate extends React.Component {

    constructor(props){
        super(props);
        const itemsPerPage = 3; // only 3 items can be on the page.
        this.state = {
            currentPage: props.currentPage,
            totalPages: props.currentPage
        }
        this.setPreviousPage = this.setPreviousPage.bind(this);
        this.setNextPage = this.setNextPage.bind(this);
    }

    setPreviousPage = () => {
        var value = 0;
        if(this.props.currentPage === 1){
            value = this.props.currentPage; 
        } else {
            value = (this.props.currentPage)-1;
        }
        this.setState({
            currentPage: value
        })
        return value;
    }

    setNextPage = () => {
        var value = 0;
        if(this.props.currentPage == this.props.totalPages){
            value = this.props.totalPages; 
        } else {
            value = (this.props.currentPage)+1;
        }
        this.setState({
            currentPage: value
        }) 
        return value;
    }

    render(){
        return(
            <Pagination>
                <Pagination.Prev onClick={this.setPreviousPage}>PREVIOUS</Pagination.Prev>
                <Pagination.Item>{this.props.currentPage}</Pagination.Item>
                <Pagination.Next onClick={this.setNextPage}>NEXT</Pagination.Next>
            </Pagination>
        );
    }

    
}

