import { HashRouter, Routes, Route } from 'react-router'
import MapComponent from './components/MapEditor'
import DataTable from './components/DataPage/DataTable'
import DataUpload from './components/DataPage/DataUpload'
import ModelRunAlert from './components/AlertPage/ModelRunAlert'
import LayerPage from './components/LayerPage/LayerPage'
import ThreeDTilesLoad from './components/AlertPage/threeDTilesLoad'
import CanvasOverlay from './components/LayerPage/CanvasOverlay'
import { NavMenu } from './components/layout/NavMenu'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { pipeline } from 'stream'

function App(): JSX.Element {
  const RADIO_ITEMS = ['Dark', 'Light']
  const [radioSelection, setRadioSelection] = useState(RADIO_ITEMS[0])
  const [showDataTable, setShowDataTable] = useState(false)
  const [showDataUpload, setShowDataUpload] = useState(false)
  const [showModelRunAlert, setShowModelRunAlert] = useState(false)
  const [showLayerPage, setShowLayerPage] = useState(false)
  const [steps, setSteps] = useState(0)
  const [pipelineAgreed, setPipelineAgreed] = useState(false)
  const [threeDTileAgreed, setThreeDTileAgreed] = useState(false);
  const [floodingResultAgreed, setFloodingResultAgreed] = useState(false);
  const [showThreeDTilesLoading, setShowThreeDTilesLoading] = useState(false);

  useEffect(() => {
    if (showModelRunAlert) {
      const interval = setInterval(() => {
        setSteps((prevSteps) => prevSteps + 50)
      }, 1000)
      return (): void => clearInterval(interval)
    } else {
      return
    }
  }, [showModelRunAlert])

  const toggleDataTable = (): void => {
    setShowDataTable(true)
    setShowDataUpload(false)
    setShowLayerPage(false)
    setShowModelRunAlert(false)
  }
  const toggleDataUpload = (): void => {
    setShowDataUpload(true)
    setShowDataTable(false)
    setShowLayerPage(false)
    setShowModelRunAlert(false)
  }
  const toggleModelRunAlert = (): void => {
    setShowModelRunAlert(true)
    setShowLayerPage(true)
    setShowDataTable(false)
    setShowDataUpload(false)
  }
  const toggleLayerPage = (): void => {
    setShowLayerPage(true)
    setShowDataTable(false)
    setShowDataUpload(false)
    setShowModelRunAlert(false)
  }
  const closeDataTable = (): void => {
    setShowDataTable(false)
  }
  const closeDataUpload = (): void => {
    setShowDataUpload(false)
  }
  const closeModelRunAlert = (): void => {
    setShowModelRunAlert(false)
  }
  const closeLayerPage = (): void => {
    setShowLayerPage(false)
  }

  const handleTestAPIClick = async (): Promise<void> => {
    // const data = {
    //   a: '123',
    //   b: '456'
    // }
    // try {
    //   // 使用异步调用等待主进程返回处理结果
    //   const result = await window.api.sendJSONToMain(JSON.stringify(data))
    //   console.log('Received processed result:', result)
    // } catch (error) {
    //   console.error('Error processing JSON:', error)
    // }
    try {
      // 发送 GET 请求到 API
      const response = await axios.get('http://localhost:3000/api/test/run-python?name=NNU')

      // 处理返回的数据，例如更新 UI
      console.log('API Response:', response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleTestAPIClick2 = async (): Promise<void> => {
    const response = await axios.get('http://localhost:3000/api/test/data')
    console.log('API2 Response:', response.data)
  }

  return (
    <HashRouter>
      <NavMenu
        radioItems={RADIO_ITEMS}
        selectedMode={radioSelection}
        onModeChange={setRadioSelection}
        onDataTableToggle={toggleDataTable}
        onDataUploadToggle={toggleDataUpload}
        onModelRunAlertToggle={toggleModelRunAlert}
        onLayerPageToggle={toggleLayerPage}
        handleTestAPIClick={handleTestAPIClick}
        handleTestAPIClick2={handleTestAPIClick2}
      />
      <div className="flex h-full mx-auto relative">
        {showDataTable && <DataTable isVisible={true} 
          onClose={closeDataTable} 
          pipelineAgreed={pipelineAgreed} setPipelineAgreed={setPipelineAgreed}
          threeDTileAgreed={threeDTileAgreed} setThreeDTileAgreed={setThreeDTileAgreed} 
          floodingResultAgreed={floodingResultAgreed} setFloodingResultAgreed={setFloodingResultAgreed} 
          showThreeDTilesLoading={showThreeDTilesLoading} setShowThreeDTilesLoading={setShowThreeDTilesLoading}
        />}
        {showDataUpload && <DataUpload isVisible={true} onClose={closeDataUpload} />}
        {showModelRunAlert && (<ModelRunAlert isVisible={true} onClose={closeModelRunAlert} steps={steps} />)}
        {showLayerPage && <LayerPage isVisible={true} onClose={closeLayerPage} steps={steps} />}
        {showThreeDTilesLoading && <ThreeDTilesLoad isVisible={showThreeDTilesLoading} onClose={() => {setShowThreeDTilesLoading(false); setThreeDTileAgreed(false)}} />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<MapComponent viewMode={radioSelection} 
              pipelineAgreed={pipelineAgreed} setPipelineAgreed={setPipelineAgreed}
              threeDTileAgreed={threeDTileAgreed} setThreeDTileAgreed={setThreeDTileAgreed}
              floodingResultAgreed={floodingResultAgreed} setfloodingResultAgreed={setFloodingResultAgreed}
            />}></Route>
          </Routes>
        </div>
        <CanvasOverlay />
      </div>
    </HashRouter>
  )
}

export default App
