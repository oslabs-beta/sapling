import React, { useEffect } from 'react';

// Import Redux Related:
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

const mapStateToProps = ({ tickets }) => ({
  eventList: tickets.eventList,
});

const mapDispatchToProps = (dispatch) => ({
  getEvents: (dateRange) => {
    dispatch(actions.getEventsActionCreator(dateRange));
  },
  eventFilter: (filterStr) => {
    dispatch(actions.eventFilterActionCreator(filterStr));
  },
  addWatchlist: (event_id) => {
    dispatch(actions.addWatchlistActionCreator(event_id));
  },

});

// WatchList Component
const Main = (props) => {
  // Get events when component mounts
  useEffect(() => {
    props.getEvents();
  }, []);

  console.log('THIS IS THE EVENTLIST: ', props.eventList, typeof props.eventList);
  const events = props.eventList.map((eventObj, i) => (
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
              {props.authUser ? (
                <button
                  type="button"
                  className="btn btn-sm btn-info"
                  onClick={() => props.addWatchlist(eventObj.id)}
                >
                  Add to Watchlist
                </button>
              )
                : null }
            </div>
          </div>
        </div>

      </div>
    </div>
  ));

  return (
    <div className="container">
      <h1>Events Near You:</h1>

      <p>
        Select Date Range:
        <select
          onChange={
            (e) => {
              console.log(e.target.value);
              props.getEvents(e.target.value);
            }
          }
        >
          <option value="">Next 24 Hours</option>
          <option value="7">Next 7 Days</option>
          <option value="30">Next 30 Days</option>
        </select>
      </p>

      <p>
        Filter Events by type:
        <select
          onChange={
            (e) => {
              console.log('Changed event filter: ', e.target.value);
              props.eventFilter(e.target.value);
            }
          }
        >
          <option value="">All Events</option>
          <option value="sports">Sporting Events</option>
          <option value="concert">Concerts</option>
          <option value="theater">Theater</option>
          <option value="comedy">Comedy Shows</option>
        </select>
      </p>


      {/* <button type="button"
      // onClick {() => props. > }
      >
        Find Events
      </button> */}
      <hr />
      <h3>{`${props.eventList.length} events found:`}</h3>

      {/* EVENT CARDS */}
      <div className="row">
        {events.length ? (events) : <h3>No events found!</h3>}
      </div>
    </div>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
