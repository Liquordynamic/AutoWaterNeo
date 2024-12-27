import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import DemLayer from '@renderer/demLayer'
import DeckGL from '@deck.gl/react'
import NHMap from '@renderer/common/NHMap'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapboxOverlay } from "@deck.gl/mapbox";
import { Tile3DLayer } from '@deck.gl/geo-layers'
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { userInfo } from 'os'

interface MapComponentProps {
  initialLongitude?: number
  initialLatitude?: number
  initialZoom?: number
  maxZoom?: number
  viewMode?: string
  showThreeDTile: boolean
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialLongitude = 114.051537,
  initialLatitude = 22.446937,
  initialZoom = 11,
  maxZoom = 22,
  viewMode = 'Dark',
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

      //瓦片分块
      const title1 = new Tile3DLayer({
        id: '3d-tile-1',
        data: '/3DTiles/6-NW-4D/tileset.json',
        loader: Tiles3DLoader,
        loadOptions: {
          "3d-tiles": {
            loadGLTF: true,
            decodeQuantizedPositions: false,
            isTileset: "auto",
            assetGltfUpAxis: null,
          },
        },
      })
      const title2 = new Tile3DLayer({
        id: '3d-tile-2',
        data: '/3DTiles/6-NW-5D/tileset.json',
        loader: Tiles3DLoader,
        loadOptions: {
          "3d-tiles": {
            loadGLTF: true,
            decodeQuantizedPositions: false,
            isTileset: "auto",
            assetGltfUpAxis: null,
          },
        },
      })
      const title3 = new Tile3DLayer({
        id: '3d-tile-3',
        data: '/3DTiles/6-NW-10D/tileset.json',
        loader: Tiles3DLoader,
        loadOptions: {
          "3d-tiles": {
            loadGLTF: true,
            decodeQuantizedPositions: false,
            isTileset: "auto",
            assetGltfUpAxis: null,
          },
        },
      })

      const deckOverlay = new MapboxOverlay({ layers: [title1, title2, title3] });
      mapInstance.addControl(deckOverlay as any); //加载3D瓦片

      mapInstance.addLayer(new DemLayer() as mapboxgl.AnyLayer) 



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

  return (
    <div id="map-container" className="relative top-0 w-screen h-full min-h-24 z-0 grow" />
  )
}
export default MapComponent
