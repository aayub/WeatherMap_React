import React, {Component} from "react";
import Home from "../Pages/Home/Home";
import Result from './../Pages/ShowResults/Result';
const APIKey = '80dcb32e2ffe920fe784f29170ecefe0';
const url = 'http://api.openweathermap.org/data/2.5/';

export default class FetchData extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            defaultLocation: {
                response: "",
                default: false,
                long: 0,
                lat: 0
            },
            response: {
                responses: [],
                responsesCount: 0,
            },
            errormsg: undefined,
            searched: false
        };
        this.setData = this.setData.bind(this);
        this.getDefaultCity = this.getDefaultCity.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getResponses = this.getResponses.bind(this);
        this.handleToggleDetailsFromFetch = this.handleToggleDetailsFromFetch.bind(this);
    }

    handleToggleDetailsFromFetch(data){
        console.log("called in fetch");
        this.props.handleVisited(data);
    }

    
    setData(){
        this.setState({
            errormsg: this.props.errormsg,
            defaultLocation: {
                default: this.props.default
            }
        })
        this.getResponses();
    }

    componentDidMount(){
        this.setData();
        this.getLocation();
        this.getResponses();
    }

    componentDidUpdate(newProps){
        if(newProps.ids !== this.props.ids && this.props.count > 0){
            this.setData();
        }
    }
    
    getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
            (pos)=>{
                this.setState({
                    defaultLocation : {
                        default: true,
                        lat: Number(pos.coords.latitude).toFixed(7),
                        long: Number(pos.coords.longitude).toFixed(7)
                    }
                }, () => this.getDefaultCity()
                )
            }, 
            (error) => {
                this.setState({
                    errormsg: error
                });
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
            )
            
        }
        else {
            this.setState({
                errormsg: 'There was an error getting your current location'
            });
        }
    }


    /* EITHER GET DEFAULT CITY OR RESPONSES */
    getResponses(){
        let idString = '';
        if(this.props.ids != [] && this.props.count > 0){
            // remove last comma
            idString = this.props.ids;
            idString = idString.toString().substring(0, idString.length - 1);
            //console.log("IDS: " + idString);
            //console.log("LENGTH: " + this.state.count);

            if(this.props.count != 0){
                let apiURL = `${url}group?id=${idString}&units=metric&appid=${APIKey}`
                //var apiCall = await fetch(apiURL);
                //fetch(apiURL).json()
                fetch(apiURL)
                .then(apiCall => {return apiCall.json()})
                .then(res => {return res})
                .then(data => {
                    console.log("Data:" + data.cnt);
                    this.setState({
                       response : {
                           responses: data.list,
                           responsesCount: data.cnt,
                       }
                    });
                })
                .catch(error => this.setState({
                    errormsg: error.message
                }))
            }
        }
    }

    async getDefaultCity(){
        let apiURL = `${url}weather?units=metric&lat=${this.state.defaultLocation.lat}&lon=${this.state.defaultLocation.long}&appid=${APIKey}`
        var apiCall = await fetch(apiURL);
        await apiCall.json()
        .then(data => {
            this.setState({
                defaultLocation: {
                    response: data,
                    default: true
                },
            });
        })
        .catch(error => this.setState({ 
            errormsg: error.message
        }));
    }

    render(){
        if(this.state.defaultLocation.default && this.state.responsesCount == 0){
            return(<Result response={this.state.defaultLocation.response}/>)
        } else {
        // determine if a search has been made:
        return(<Home 
            // local states
            ids={this.props.ids}
            idsCount={this.props.count}
            errormsg={this.props.errormsg}
            // props passed from navigationbar
            searched={this.state.searched}
            responses={this.state.response.responses}
            responsesCount={this.state.response.responsesCount}
            defaultLocation={this.state.defaultLocation.response}
            handleToggleDetailsFromFetch={this.handleToggleDetailsFromFetch}
            />)
        }
    }

}