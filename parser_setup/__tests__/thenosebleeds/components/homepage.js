import React, { Component } from 'react';
class HomePage extends Component {
  constructor (props) {
      super(props)
      this.state = {
          lowestDodgerPrice: '',
          DodgerUrl: '',
          lowestAngelPrice: '',
          AngelUrl: '',
          lowestLafcPrice: '',
          lowestGalaxyPrice: '',
          lowestLakerTicket: '',
          lowestChargerTicket: '',
          lowestClipperTicket: '',
          lowestRamTicket: '',
          isUser: false,
          dodgerCardValue:'',
      }
      //this.handleDodgerPriceChange = this.handleDodgerPriceChange.bind(this);
      // this.handleGalaxyPriceChange = this.handleGalaxyPriceChange.bind(this);
      // this.handleAngelPriceChange = this.handleAngelPriceChange.bind(this);
      // this.handleLafcPriceChange = this.handleLafcPriceChange.bind(this);
      // this.handleLakerTicketChange = this.handleLakerTicketChange.bind(this);
      // this.handleClipperTicketChange = this.handleClipperTicketChange.bind(this);
      // this.handleRamTicketChange = this.handleRamTicketChange.bind(this);
      // this.lowestChargerTicket = this.lowestChargerTicket.bind(this)
      // this.handleOnClick = this.handleOnclick.bind(this);
  }

  // handleLakerClick(event) {
  //     this.setState({lowestLakerTicket: event.target.value});
  //   }

  //   handleClipperClick(event) {
  //     this.setState({lowestClipperTicket: event.target.value});
  //   }

  //   handleRamClick(event) {
  //     this.setState({lowestRamTicket: event.target.value});
  //   }

  //   handleDodgerClick(event) {
  //     this.setState({lowestDodgerPrice: event.target.value});
  //   }

  //   handleAngelClick(event) {
  //     this.setState({lowestAngelPrice: event.target.value});
  //   }

  //   handleChargerClick(event) {
  //     this.setState({lowestChargerTicket: event.target.value});
  //   }

  //   handleGalaxyClick(event) {
  //     this.setState({lowestGalaxyPrice: event.target.value});
  //   }

  //   handleLafcClick(event) {
  //     this.setState({lowestLafcPrice: event.target.value});
  //   }

  // .stats.lowest_price_good_deals
  // .url
  filterData = (reference) => {
      const teamArr = ['los-angeles-dodgers', 'los-angeles-lakers', 'los-angeles-clippers', 'los-angeles-angels', 'los-angeles-chargers', 'los-angeles-rams', 'los-anageles-galaxy'];
      for (let i = 0; i < teamArr.length-1; i++){
      let teamApi = baseApi +teamArr[reference];
      this.getData(teamApi,reference)}      let baseApi = 'https://api.seatgeek.com/2/events?client_id=MjMwODQ2OTZ8MTYzMDA5MTEwMy4xMjAzNg&geoip=true&performers.slug=';

  }
  getData = (teamApi, reference) =>{fetch(teamApi)
  .then(response => response.json())
  .then(data =>{
    let today = new Date();
    let date = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+'0'+today.getDate();
    console.log(date);
    if (reference ===0)
    { this.setState({lowestDodgerPrice: "$" + data.events[0].stats.lowest_sg_base_price + " lowest Dodgers ticket price", DodgerUrl: data.events[0].url }) }
    else if (reference === 3)
    { this.setState({lowestAngelPrice: "$" + data.events[0].stats.lowest_sg_base_price + " lowest Angels ticket price", AngelUrl: data.events[0].url}) }


  //  handleDodgerClick(event) {
  //     this.setState({lowestDodgerPrice: data.events[0].stats.lowest_price_good_deals});
  //   }
  //   handleSubmit(event) {
  //     this.setState({lowestDodgerPrice: data.events[0].stats.lowest_price_good_deals});
  //     event.preventDefault();
  //   }

  render () {
    //this.filterData();
    console.log('this is state', this.state);
     return (
        <div>
        <head>
        </head>
        <body>
            <h1 id="profile">CLICK ON A TEAM TO SEE THE LOWEST TICKET PRICE OF THE DAY</h1>
            <div className="search"><input id="searchBar" placeholder="search"></input><button id="searchButton">SEARCH</button></div>
            <div class="tab">
                <button className="lakerButton"  onClick="lowest price laker ticket">LAKERS</button>
                <button className="clipperButton" onClick="lowest price clipper ticket">CLIPPERS</button>
                <button className="ramButton" onClick="lowest price rams ticket">RAMS</button>
                <button className="dodgerButton" value={this.state.lowestDodgerPrice} val={this.state.DodgerUrl} onClick={(e)=> {
                    e.preventDefault();
                    this.filterData(0)
                    }}>DODGERS</button>
                <button className="angelButton" value={this.state.lowestAngelPrice} onClick={(e)=> {
                    e.preventDefault();
                    this.filterData(3)

                    }}>ANGELS</button>
                <button className="lafcButton" onClick="lowest price lafc ticket')">LAFC</button>
                <button className="galaxyButton" onClick="lowest price galaxy ticket')">GALAXY</button>
                <button className="chargersButton" onClick="lowest price chargers ticket')">CHARGERS</button>
            </div>
            <div className="priceAndTicket">
            <a className="priceLink" href={this.state.DodgerUrl}>{this.state.lowestDodgerPrice}</a>
            </div>
            <div className="priceAndTicket">
            <a className="priceLink" href={this.state.AngelUrl}>{this.state.lowestAngelPrice}</a>
            </div>
        </body>
        </div>
    )
  }
}

export default HomePage;