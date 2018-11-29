import React from 'react';

const VenueList = (props) => {
  const venues = props.venues;
  return (
    <div>
    <label className="label" htmlFor="searchBox">Search Box</label>
      <input
        id="searchBox"
        type="text"
        placeholder="Type here to filter locations"
        value={props.query}
        onChange={event => props.updateQuery(event.target.value)}
      />
      <ul className="venue-list">
      { venues && (venues.map((venue, index) =>
        <li className="list-item" key={index}>
          <button
            className="item"
            name={venue.city}
            key={index}
            onClick={event => props.onListClick(venue, index)}>{venue.city}
          </button>
        </li>
      ))}
      </ul>
    </div>
  );
}

export default VenueList;
