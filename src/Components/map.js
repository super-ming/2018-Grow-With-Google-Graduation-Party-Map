import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import ErrorBoundary from './errorboundary';

window.gm_authFailure = ()=>{
  alert("Invalid Google API key. Please check your Google API key");
};

const googleMapsAPI = process.env.REACT_APP_googleMapsAPI;

class MapContainer extends Component {
  componentDidMount() {
    this.getEventInfo();
  }

  mapReady = (props,map) => {
    //setTimeout is added to ensure that data from API is available in order to create the markers.
    setTimeout(() => {
      this.addMarkers(map);
    }, 1300);
  }
  //fetch event info
  getEventInfo = () => {
    let searchResults = [];
    const placeSearchUrl = "https://api.myjson.com/bins/15lojm"
    let headers = new Headers();
    let request = new Request(placeSearchUrl, {
      method: 'GET',
      headers
    });

    fetch(request).then(res => {
      if (!res.ok) {
        throw Error (`Request rejected with status code ${res.status}`);
      } else {
        return res.json()
      }}).then(res => {
      res.events.forEach((result, index)=> {
        let event = {};
        event.city = result.city;
        event.name = result.name;
        event.lat = result.lat;
        event.lng = result.lng;
        event.time = result.time;
        event.host = result.host;
        event.link = result.link;
        searchResults.push(event);
      });
    }).catch(err=> {
      alert("Something went wrong."+ err);
    })
    this.props.getResults(searchResults);
  }

  addMarkers(map) {
    let markers = [];
    const infoWindow = new this.props.google.maps.InfoWindow();

    if(this.props.results){
      for (let event of this.props.results){
        const marker = new this.props.google.maps.Marker({
          position: {lat: event.lat, lng: event.lng},
          map: map,
          title: event.name,
          animation: 2  //Drop
        });
        markers.push(marker);
        const infoContent = `<h4>${event.city}</h4><p>Venue: ${event.name}</p><p>Time: ${event.time}</p><p>Host: ${event.host}</p><a href=${event.link}>Event Page</a>`;
        ['click', 'mouseover'].forEach(e => {
          marker.addListener(e, ()=> {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(1); //Bounce
          }
            infoWindow.setContent(infoContent);
            infoWindow.open(map, marker);
            this.props.onMarkerClick(event, marker, infoWindow);
            this.props.showWindow();
          }, false);
        });
        infoWindow.addListener('closeclick', ()=>{
          marker.setAnimation(null);
          this.props.onInfoWindowClose();
        })
      }
    }
    this.props.getMap(markers, infoWindow, map, this.props.google);
  }

  onMapClicked = ()=>{
    if(this.props.infoWindow){
      this.props.infoWindow.close();
    }
    this.props.allMarkers.forEach(marker=>{
      marker.setAnimation(null);
    }, this.props.onInfoWindowClose)
    this.props.updateQuery(this.props.query);
  }

  render() {
    if(window.google){
      return (
        <ErrorBoundary>
          <Map
            aria-label="map"
            className="map"
            role="application"
            google={this.props.google}
            initialCenter={{lat:39.011902, lng:-98.484246}}
            onClick={this.onMapClicked}
            onReady={this.mapReady}
            zoom={4}>
          </Map>
        </ErrorBoundary>
      )
    } else {
      return(
        <div>Error loading Google Maps</div>
      )
    }
  }
}

export default GoogleApiWrapper({
  apiKey: (`AIzaSyB8K2MYqSFftmrT_c8i1yG3uypVsrcutN4`)
})(MapContainer)
