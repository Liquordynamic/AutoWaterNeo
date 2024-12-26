import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import DeckGL from '@deck.gl/react'
import { Tile3DLayer } from '@deck.gl/geo-layers' // 直接导入 Tile3DLayer
import NHMap from '@renderer/common/NHMap'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapComponentProps {
  initialLongitude?: number
  initialLatitude?: number
  initialZoom?: number
  maxZoom?: number
  viewMode?: string
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialLongitude = 114.051537,
  initialLatitude = 22.446937,
  initialZoom = 11,
  maxZoom = 22,
  viewMode = 'Dark'
}) => {
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNrenozdWdodDAza3EzY3BtdHh4cm5pangifQ.ZigfygDi2bK4HXY1pWh-wg'

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

      setMap(mapInstance)      
      
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
  }, [viewMode])

  // // 使用 Tile3DLayer，无需导入 Tile3DLoader
  // const tile3DLayer = new Tile3DLayer({
  //   id: 'tile-3d-layer',
  //   data: '@src/public/6-NW-4D/tileset.json', // 替换为你的 tileset.json URL
  //   onTilesetLoad: (tileset) => {
  //     console.log('Tileset loaded:', tileset)
  //   },
  //   pickable: true,
  //   autoHighlight: true,
  //   highlightColor: [60, 60, 60, 40]
  // })

  // return (
  //   <DeckGL
  //     initialViewState={{
  //       longitude: initialLongitude,
  //       latitude: initialLatitude,
  //       zoom: initialZoom,
  //       maxZoom: maxZoom
  //     }}
  //     controller={true}
  //     layers={[tile3DLayer]}
  //   >
  //     <div id="map-container" className="relative top-0 w-screen h-full min-h-24 z-0 grow" />
  //   </DeckGL>
  // )
}

export default MapComponent
