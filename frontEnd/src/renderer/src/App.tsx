import { HashRouter, Routes, Route } from 'react-router'
import MapComponent from './components/MapEditor'
import DataTable from './components/DataPage/DataTable'
import DataUpload from './components/DataPage/DataUpload'
import ModelRunAlert from './components/ModelPage/ModelRunAlert'
import { NavMenu } from './components/layout/NavMenu'
import { useState, useEffect } from 'react'
import LayerPage from './components/LayerPage/LayerPage'

function App(): JSX.Element {
  const RADIO_ITEMS = ['Dark', 'Light']
  const [radioSelection, setRadioSelection] = useState(RADIO_ITEMS[0])
  const [showDataTable, setShowDataTable] = useState(false); 
  const [showDataUpload, setShowDataUpload] = useState(false); 
  const [showModelRunAlert, setShowModelRunAlert] = useState(false); 
  const [showLayerPage, setShowLayerPage] = useState(false); 
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    if (showModelRunAlert) {
      const interval = setInterval(() => {
        setSteps(prevSteps => prevSteps + 50);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showModelRunAlert]);

  const toggleDataTable = () => {
    setShowDataTable(true);
    setShowDataUpload(false);
    setShowLayerPage(false);
    setShowModelRunAlert(false);
  }
  const toggleDataUpload = () => {
    setShowDataUpload(true);
    setShowDataTable(false);
    setShowLayerPage(false);
    setShowModelRunAlert(false);
  }
  const toggleModelRunAlert = () => {
    setShowModelRunAlert(true);
    setShowLayerPage(true);
    setShowDataTable(false);
    setShowDataUpload(false);
  }
  const toggleLayerPage = () => {
    setShowLayerPage(true);
    setShowDataTable(false);
    setShowDataUpload(false);
    setShowModelRunAlert(false);
  }
  const closeDataTable = () => {
    setShowDataTable(false);
  }
  const closeDataUpload = () => {
    setShowDataUpload(false);
  }
  const closeModelRunAlert = () => {
    setShowModelRunAlert(false);
  }
  const closeLayerPage = () => {
    setShowLayerPage(false);
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
      />
      <div className='flex h-full mx-auto relative'>
        {showDataTable && <DataTable isVisible={true} onClose={closeDataTable}/>}
        {showDataUpload && <DataUpload isVisible={true} onClose={closeDataUpload} />}
        {showModelRunAlert && <ModelRunAlert isVisible={true} onClose={closeModelRunAlert} steps={steps} /> }
        {showLayerPage && <LayerPage isVisible={true} onClose={closeLayerPage} steps={steps} /> }

        <div className='flex-grow'>
          <Routes>
            <Route path="/" element={<MapComponent viewMode={radioSelection} />}></Route>
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
