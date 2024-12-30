import React, { useEffect, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import DemLayer from '@renderer/demLayer'
import NHMap from '@renderer/common/NHMap'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { Tile3DLayer } from '@deck.gl/geo-layers'
import { Tiles3DLoader } from '@loaders.gl/3d-tiles'

interface MapComponentProps {
  initialLongitude?: number
  initialLatitude?: number
  initialZoom?: number
  maxZoom?: number
  viewMode?: string
  showThreeDTile?: boolean
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialLongitude = 114.051537,
  initialLatitude = 22.446937,
  initialZoom = 11,
  maxZoom = 22,
  viewMode = 'Dark'
}) => {
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)

  // 3D瓦片的配置数据
  const tileLayerData = [
    '6-NW-4D',
    '6-NW-5D',
    '6-NW-10D',
    '6-NW-4C',
    '6-NW-5C',
    '6-NW-9B',
    '6-NW-9C',
    '6-NW-9D',
    '6-NW-10A',
    '6-NW-10B',
    '6-NW-10C'
  ]

  // 创建Tile3DLayer的通用函数
  const createTileLayer = useCallback((id: string) => {
    return new Tile3DLayer({
      id,
      data: `http://localhost:3000/${id}/tileset.json`,
      loader: Tiles3DLoader,
      loadOptions: {
        loadGLTF: true,
        decodeQuantizedPositions: false,
        isTileset: 'auto',
        assetGltfUpAxis: null
      }
    })
  }, [])

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

      mapInstance.on('load', () => {
        // 添加DeckGL Overlay
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tileLayers = tileLayerData.map(createTileLayer)
        const deckOverlay = new MapboxOverlay({ interleaved: true, layers: tileLayers })
        mapInstance.addControl(deckOverlay as any)
        // Add DEM Layer
        mapInstance.addLayer(new DemLayer() as mapboxgl.AnyLayer)
        setMap(mapInstance)
      })

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

  return <div id="map-container" className="relative top-0 w-screen h-full min-h-24 z-0 grow" />
}
export default MapComponent
