import React, { useEffect, useCallback, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import DemLayer from '@renderer/demLayer'
import NHMap from '@renderer/common/NHMap'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { Tile3DLayer } from '@deck.gl/geo-layers'
import { Tiles3DLoader } from '@loaders.gl/3d-tiles'

/////// tube geo-data
import channelJson from '../assets/channel.json'
import catchpitJson from '../assets/catchpit.json'

////// layers
import PenerateLayer from '../TubeLayer/layers/ScreenPenerateLayer.js'
import TubeLayer from '../TubeLayer/layers/TubeLayer.js'
// import ChannelLayer from '../TubeLayer/layers/undergroundLayers/ChannelLayer.js';
// import CatchpitLayer from '../TubeLayer/layers/undergroundLayers/CatchpitLayer';

interface MapComponentProps {
  initialLongitude?: number
  initialLatitude?: number
  initialZoom?: number
  maxZoom?: number
  viewMode?: string
  pipelineAgreed?: boolean
  showThreeDTile?: boolean
  threeDTileAgreed?: boolean;
  floodingResultAgreed?: boolean;
  setPipelineAgreed?: (value: boolean) => void;
  setThreeDTileAgreed?: (value: boolean) => void;
  setfloodingResultAgreed?: (value: boolean) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialLongitude = 114.051537,
  initialLatitude = 22.446937,
  initialZoom = 11,
  maxZoom = 22,
  viewMode = 'Dark',
  pipelineAgreed = false,
  threeDTileAgreed = false,
  floodingResultAgreed = false,
}) => {
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)
  const [tileLayers, setTileLayers] = useState<Tile3DLayer[]>([]);
  const [deckOverlay, setDeckOverlay] = useState<MapboxOverlay | null>(null);

  let BBOX = [-1, -1, 1, 0]
  const NDCPenerateLayer = new PenerateLayer("penetrate-layer", BBOX)

  // 水淹效果图层
  const floodingLayer = new DemLayer() as mapboxgl.AnyLayer;

  // 3D瓦片的配置数据
  const tileLayerData = [
    '6-NE-1A', '6-NE-1C',
    // '6-NE-6A', '6-NE-6C', 
    '6-NW-4A', '6-NW-4B', '6-NW-4C', '6-NW-4D',
    '6-NW-5A', '6-NW-5B', '6-NW-5C', '6-NW-5D',
    // '6-NW-9B', '6-NW-9C', '6-NW-9D',
    // '6-NW-10A', '6-NW-10B', '6-NW-10C','6-NW-10D', 
  ];

  // 创建Tile3DLayer的通用函数
  const createTileLayer = useCallback((id: string) => {
    return new Tile3DLayer({
      id,
      data: `http://localhost:3000/${id}/tileset.json`,  //!!!更改加载方式!!!
      loader: Tiles3DLoader,
      loadOptions: {
        loadGLTF: true,
        decodeQuantizedPositions: false,
        isTileset: 'auto',
        assetGltfUpAxis: null
      },
      // onTilesetLoad: (tileset) => {
      //   const { cartographicCenter, zoom } = tileset;
      //   this.deckOverlay.setProps({
      //     initialViewState: {
      //       longitude: cartographicCenter[0],
      //       latitude: cartographicCenter[1],
      //     },
      //   });
      // }
    })
  }, [])

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNrenozdWdodDAza3EzY3BtdHh4cm5pangifQ.ZigfygDi2bK4HXY1pWh-wg'

    const initializeMap = () => {
      const mapInstance = new NHMap({
        container: 'map-container',
        style:
          viewMode == 'Dark'
            ? 'mapbox://styles/ycsoku/cm3zhjxbs00pa01sd6hx7grtr'
            : 'mapbox://styles/mapbox/light-v10',
        center: [initialLongitude, initialLatitude],
        zoom: initialZoom,
        maxZoom: maxZoom
      })

      mapInstance.on('load', () => {

        setMap(mapInstance)

        const config = {
          line_geojson: channelJson,
          canvas: document.querySelector("#deck"),
          minZoom: 10,
          maxZoom: 20
        }
        const tubeLayer = new TubeLayer("tube_layer", config)

        /////// under ground layer group
        // const tubeLayer = new TubeLayer("tube_layer", document.querySelector("#deck"))
        mapInstance.addLayer(tubeLayer)
        // mapInstance.addLayer(NDCPenerateLayer)
      });

      return (): void => {
        mapInstance.remove()
      }
    }

    if (!map) {
      initializeMap()
    } else {
      map.setStyle(
        viewMode == 'Dark'
          ? 'mapbox://styles/ycsoku/cm3zhjxbs00pa01sd6hx7grtr'
          : 'mapbox://styles/mapbox/light-v10'
      )
    }
  }, [viewMode, initialLongitude, initialLatitude, initialZoom, maxZoom])

  useEffect(() => {
    if (threeDTileAgreed && !tileLayers.length) {
      const newTileLayers = tileLayerData.map(createTileLayer);
      setTileLayers(newTileLayers);
      if (map) {
        const deckOverlay = new MapboxOverlay({ interleaved: true, layers: newTileLayers });
        setDeckOverlay(deckOverlay);
        map.addControl(deckOverlay as any);
      }
    } else if (!threeDTileAgreed && tileLayers.length) {
      if (map && deckOverlay) {
        map.removeControl(deckOverlay as any);
        setDeckOverlay(null);
        setTileLayers([]);
      }
    }
  }, [pipelineAgreed, threeDTileAgreed, createTileLayer, map, tileLayers, deckOverlay]);

  // useEffect(() => {
  //   if (threeDTileAgreed) {
  //     const newTileLayers = tileLayerData.map(createTileLayer);
  //     setTileLayers(newTileLayers);

  //     if (map.getLayer('penetrate-layer')) {
  //       console.log('add tile layers with penetrate-layer');
  //       addTileLayers(newTileLayers, 'penetrate-layer');
  //     } else {
  //       console.log('add tile layers');
  //       addTileLayers(newTileLayers, undefined);
  //     }
  //   } 
  //   else if (tileLayers.length) {
  //     console.log('remove tile layers');
  //     removeTileLayers();
  //   }
  // // }, [threeDTileAgreed, createTileLayer, map, tileLayers, deckOverlay]);



  // useEffect(() => {
  //   if (map) {
  //     if (floodingResultAgreed && !map.getLayer('penetrate-layer')) {
  //       console.log('penetrate-layer没打开')
  //       map.addLayer(floodingLayer);
  //     } 
  //     else if(floodingResultAgreed && map.getLayer('penetrate-layer')) {
  //       console.log('penetrate-laye打开了')
  //       map.addLayer(floodingLayer, 'penetrate-layer');
  //     }
  //     else {
  //       if (map.getLayer(floodingLayer.id)) {
  //         map.removeLayer(floodingLayer.id);
  //       }
  //     }
  //   }
  // }, [floodingResultAgreed, map]);

  // useEffect(() => {
  //   if (map) {
  //     if (pipelineAgreed) {
  //       map.addLayer(NDCPenerateLayer)
  //     } else {
  //       if (map.getLayer("penetrate-layer"))
  //       map.removeLayer("penetrate-layer")
  //     }
  //   }
  // },[pipelineAgreed, map])

  useEffect(() => {
    if (!map) return;

    const addLayerIfNotExists = (layer, beforeId) => {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer, beforeId);
      }
    };
    const removeLayerIfExists = (layerId) => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    };

    if (floodingResultAgreed) {
      if (map.getLayer('penetrate-layer')) {
        addLayerIfNotExists(floodingLayer, 'penetrate-layer');
      } else {
        addLayerIfNotExists(floodingLayer, undefined);
      }
    } else {
      removeLayerIfExists(floodingLayer.id);
    }

    if (pipelineAgreed) {
      addLayerIfNotExists(NDCPenerateLayer, undefined);
    } else {
      removeLayerIfExists('penetrate-layer');
    }
  }, [floodingResultAgreed, pipelineAgreed, map]);

  return <div id="map-container" className="relative top-0 w-screen h-full min-h-24 z-0 grow" />
}

export default MapComponent