import React, { useEffect, useCallback, useState } from 'react'
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
  threeDTileAgreed?: boolean; // 添加状态
  setThreeDTileAgreed?: (value: boolean) => void; // 添加回调函数
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialLongitude = 114.051537,
  initialLatitude = 22.446937,
  initialZoom = 11,
  maxZoom = 22,
  viewMode = 'Dark',
  threeDTileAgreed = false, // 默认值
  setThreeDTileAgreed, // 默认值
}) => {
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)
  const [tileLayers, setTileLayers] = useState<Tile3DLayer[]>([]);

  // 3D瓦片的配置数据
  const tileLayerData = [
    '6-NW-4D',
    // '6-NW-5D', '6-NW-10D', '6-NW-4C', '6-NW-5C', '6-NW-9B',
    // '6-NW-9C', '6-NW-9D', '6-NW-10A', '6-NW-10B', '6-NW-10C',
  ];

  // 创建Tile3DLayer的通用函数
  const createTileLayer = useCallback((id: string) => {
    return new Tile3DLayer({
      id,
      data: `http://localhost:3000/3DTiles/${id}/tileset.json`,
      loader: Tiles3DLoader,
      loadOptions: {
        loadGLTF: true,
        decodeQuantizedPositions: false,
        isTileset: 'auto',
        assetGltfUpAxis: null,
      },
    });
  }, []);

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

      if (threeDTileAgreed) {
        const newTileLayers = tileLayerData.map(createTileLayer);
        setTileLayers(newTileLayers);
        const deckOverlay = new MapboxOverlay({ layers: newTileLayers });
        mapInstance.addControl(deckOverlay as any);
      } else {
        if (mapInstance.getLayer('3DTileLayer')) {
          mapInstance.removeLayer('3DTileLayer');
        }
      }

      // 动态创建所有Tile3DLayer
      // const tileLayers = tileLayerData.map(createTileLayer);
      // const deckOverlay = new MapboxOverlay({ layers: tileLayers });

      mapInstance.on('styledata', () => {
        // 添加DeckGL Overlay
        // mapInstance.addControl(deckOverlay as any);
        // Add DEM Layer
        mapInstance.addLayer(new DemLayer() as mapboxgl.AnyLayer);

        setMap(mapInstance);
      });

      // setMap(mapInstance);

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
  }, [viewMode, initialLongitude, initialLatitude, initialZoom, maxZoom, threeDTileAgreed])

  useEffect(() => {
    if (threeDTileAgreed && !tileLayers.length) {
      const newTileLayers = tileLayerData.map(createTileLayer);
      setTileLayers(newTileLayers);
      if (map) {
        const deckOverlay = new MapboxOverlay({ layers: newTileLayers });
        map.addControl(deckOverlay as any);
      }
    } else if (!threeDTileAgreed && tileLayers.length) {
      if (map) {
        const deckOverlay = new MapboxOverlay({ layers: [] });
        map.removeControl(deckOverlay as any);
        setTileLayers([]);
      }
    }
  }, [threeDTileAgreed, createTileLayer, map, tileLayers]);

  return <div id="map-container" className="relative top-0 w-screen h-full min-h-24 z-0 grow" />
}
export default MapComponent
