import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

// const mapStateToProps = ({ users }) => ({
//   watchlist: users.watchlist,
// });

const mapDispatchToProps = (dispatch) => ({
  getWatchlist: () => {
    dispatch(actions.getWatchlistActionCreator());
  },
});

// WatchList Component
const Watchlist = (props) => {
  console.log(props.getWatchlist, 'watchlist: ', props.watchlist);

  useEffect(() => {
    console.log('USING EFFECT WHEN LOADING WATCHLIST');
    props.getWatchlist();
  }, []);
  console.log('WATCHLIST in WATCHLIST COMPONENT: ', props.watchlist);
  const events = props.watchlist.map((eventObj, i) => (
    <div
      className="event-card card mb-3"
      key={i}
    >
      <div className="row g-0">

        <div className="col-md-4 col-lg-3">
          <img src={eventObj.performers[0].image} className="img-fluid rounded-start" alt="event"/>
        </div>

        <div className="col-md-8 col-lg-9">
          <div className="card-body">
            <h5 className="card-title">{eventObj.title} <span className="card-subtitle"></span></h5>
            <h6 className="card-subtitle">{eventObj.datetime_local.slice(11)} - {eventObj.datetime_local.slice(0, 10)}</h6>

            {eventObj.stats.listing_count
              ? (
                <p className="card-text prices">
                  <span>
                    Lowest Price: ${eventObj.stats.lowest_sg_base_price}
                  </span>
                  <span>
                    Average Price: ${eventObj.stats.average_price}
                  </span>
                  <span>
                    Num. Listings: {eventObj.stats.listing_count}
                  </span>
                </p>
              )
              : (
                <p className="card-text prices">
                  No tickets currently listed!
                </p>
              )}
            <div className="btn-group">
              <a className="btn btn-sm btn-primary" href={eventObj.url}>Book Tickets</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  ));

  return (
    <div className="container">
      <h1>Events In Your Watchlist:</h1>
      {/* EVENT CARDS */}
      <div className="row">
        {events.length ? (events) : <h3>No events found!</h3>}
      </div>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Watchlist);
