import React from 'react';
import { compose, withStateHandlers } from "recompose";
import { InfoWindow, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';


const Map = compose(
    withStateHandlers(() => ({
        isMarkerShown: false,
        markerPosition: null
      }), {
        onMapClick: ({ isMarkerShown }) => (e) => ({
            
            markerPosition: e.latLng,
            isMarkerShown:true
        })
      }),
    withScriptjs,
    withGoogleMap
)
    (props =>
        <GoogleMap
            defaultZoom={12}
            defaultCenter={{ lat: -35.00, lng: -59.27 }}
            onClick={props.onMapClick}
        >
            {props.isMarkerShown && <Marker position={props.markerPosition} />}

        </GoogleMap>
    )

export default class MapContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                <Map
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCWkaWnImbvcux4U2crWwrKyE3LoH290dc"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `200px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        )
    }
}