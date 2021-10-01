import * as types from '../constants/actionTypes';

const initialState = {
  allEvents: [],
  eventList: [],
  eventFilter: '',
};

const ticketReducer = (state = initialState, action) => {
  let newEventList;
  let allEvents;

  switch (action.type) {
    case types.GET_EVENTS:
      allEvents = action.payload;
      // If filtering, show only specific events:
      if (state.eventFilter) {
        newEventList = allEvents.filter((event) => {
          for (let i = 0; i < event.taxonomies.length; i += 1) {
            console.log(event.taxonomies[i].name);
            if (event.taxonomies[i].name === state.eventFilter) {
              return true;
            }
          }
          return false;
        });
      } else {
        newEventList = action.payload.slice();
      }
      return {
        ...state,
        eventList: newEventList,
        allEvents,
      };

    case types.EVENT_FILTER:
      // If filtering, show only specific events:
      if (action.payload) {
        newEventList = state.allEvents.filter((event) => {
          for (let i = 0; i < event.taxonomies.length; i += 1) {
            console.log(event.taxonomies[i].name);
            if (event.taxonomies[i].name === action.payload) {
              return true;
            }
          }
          return false;
        });
      } else {
        newEventList = state.allEvents.slice();
      }
      return {
        ...state,
        eventList: newEventList,
        eventFilter: action.payload,
      };

    default:
      return state;
  }
};

export default ticketReducer;
