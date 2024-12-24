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
  const [autoCloseModelRunAlert, setAutoCloseModelRunAlert] = useState(false);

  const toggleDataTable = () => {
    setShowDataTable((prev) => !prev);
    setShowDataUpload(false);
  }
  const toggleDataUpload = () => {
    setShowDataUpload((prev) => !prev);
    setShowDataTable(false);
  }
  const toggleModelRunAlert = () => {
    setShowModelRunAlert((prev) => !prev);
    setShowDataTable(false);
    setShowDataUpload(false);
    setAutoCloseModelRunAlert(true); // 设置自动关闭标志
  }
  const closeDataTable = () => {
    setShowDataTable(false);
  }
  const closeDataUpload = () => {
    setShowDataUpload(false);
  }
  const closeModelRunAlert = () => {
    setShowModelRunAlert(false);
    setAutoCloseModelRunAlert(false); // 重置自动关闭标志
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
      />
      <div className='flex h-full mx-auto relative'>
        {showDataTable && <DataTable isVisible={true} onClose={closeDataTable}/>}
        {showDataUpload && <DataUpload isVisible={true} onClose={closeDataUpload} />}
        {showModelRunAlert && <ModelRunAlert isVisible={true} onClose={closeModelRunAlert} /> }

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
