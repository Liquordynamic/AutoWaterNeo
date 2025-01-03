/////// 3rd PARTY
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = 'pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNrenozdWdodDAza3EzY3BtdHh4cm5pangifQ.ZigfygDi2bK4HXY1pWh-wg'


/////// tube geo-data
import channelJson from '../assets/channel.json'
import catchpitJson from '../assets/catchpit.json'

////// layers
import PenerateLayer from './layers/ScreenPenerateLayer';
import TubeLayer from './layers/TubeLayer';

export const start = () => {
    // let map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/dark-v11',
    //     // style: 'mapbox://styles/mapbox/satellite-v9',
    //     center: [114.058113056174633, 22.44979484375407],
    //     zoom: 17,
    //     projection: 'mercator'
    // })
    map.once('load', () => {
        new mapboxgl.Marker().setLngLat({
            lng: 114.058113056174633,
            lat: 22.44979484375407
        }).addTo(map)

        let BBOX = [-1, -1, 1, 0]
        const NDCPenerateLayer = new PenerateLayer("penetrate-layer", BBOX)
        const config = {
            line_geojson: channelJson,
            canvas: document.querySelector("#deck"),
            minZoom: 10,
            maxZoom: 20
        }
        const tubeLayer = new TubeLayer("tube_layer", config)
        map.addLayer(tubeLayer)
        map.addLayer(NDCPenerateLayer)

        // document.addEventListener('keydown', e => {
        //     if(e.key === 'a'){
        //         //！！！
        //         map.addLayer(tubeLayer)
        //     }
        //     if(e.key === 's'){
        //         map.removeLayer("tube_layer")
        //         console.log(tubeLayer)
        //     }
        //     if(e.key === 'd'){
        //         map.addLayer(NDCPenerateLayer)
        //     }
        //     if(e.key === 'f'){
        //         map.removeLayer("penetrate-layer")
        //     }
        // })



    })
}











