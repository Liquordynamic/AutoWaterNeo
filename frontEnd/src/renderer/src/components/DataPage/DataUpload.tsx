import React, { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import axios from 'axios'

type DataUploadProps = {
  isVisible: boolean
  onClose: () => void
}

const DataUpload: React.FC<DataUploadProps> = ({ isVisible, onClose }) => {
  const [dirroot, setDirroot] = useState<string>('')
  const [resroot, setResroot] = useState<string>('')
  const [sim_time, setSimTime] = useState<string>('')
  const [initial_tstep, setInitialTstep] = useState<string>('')
  const [massint, setMassint] = useState<string>('')
  const [saveint, setSaveint] = useState<string>('')

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const originalValue = input.value
    const filteredValue = originalValue
      .replace(/[^0-9.]/g, '')
      .replace(/^\./, '')
      .replace(/(\..*?)\./g, '$1')
    if (filteredValue !== originalValue) {
      input.value = filteredValue
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const formData = {
      dirroot: dirroot,
      resroot: parseFloat(resroot), // 假设这些值应该是数字
      sim_time: parseFloat(sim_time),
      initial_tstep: parseFloat(initial_tstep),
      massint: parseFloat(massint),
      saveint: parseFloat(saveint)
    }

    axios
      .post('/upload-data', formData)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error uploading data:', error)
      })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'dirroot':
        setDirroot(value)
        break
      case 'resroot':
        setResroot(value)
        break
      case 'sim_time':
        setSimTime(value)
        break
      case 'initial_tstep':
        setInitialTstep(value)
        break
      case 'massint':
        setMassint(value)
        break
      case 'saveint':
        setSaveint(value)
        break
      // case 'DEMfile':
      //     setDEMfile(value);
      //     break;
      // 处理其他输入字段的变化
      // ...
      default:
        break
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-white p-1 rounded-lg shadow-md absolute top-5 left-5 bottom-10 w-1/6 z-10 ">
      <div className="bg-white p-4 w-full h-full overflow-auto">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="bg-cyan-100 rounded-lg p-1">
            <SectionHeading title="Data Upload" subTitle="" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 pb-6">
            <div className="col-span-full border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">DEM</h2>
              <div className="col-span-full">
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto size-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="DEM"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="DEM" name="DEM" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">DEM File Please</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">LISFLOOD-FP</h2>
              <div className="sm:col-span-3">
                <label htmlFor="dirroot" className="block text-sm/6 font-medium text-gray-900">
                  dirroot
                </label>
                <div>
                  <input
                    id="dirroot"
                    name="dirroot"
                    type="file"
                    value={dirroot}
                    onChange={handleInputChange}
                    className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="resroot" className="block text-sm/6 font-medium text-gray-900">
                  resroot
                </label>
                <div>
                  <input
                    id="resroot"
                    name="resroot"
                    type="text"
                    autoComplete="off"
                    onInput={handleNumericInput}
                    value={resroot}
                    onChange={handleInputChange}
                    placeholder="Please enter a floating point number"
                    className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="sim_time" className="block text-sm/6 font-medium text-gray-900">
                  sim_time
                </label>
                <div>
                  <input
                    id="sim_time"
                    name="sim_time"
                    type="text"
                    autoComplete="off"
                    onInput={handleNumericInput}
                    value={sim_time}
                    onChange={handleInputChange}
                    placeholder="Please enter a floating point number"
                    className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="initial_tstep"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  initial_tstep
                </label>
                <div>
                  <input
                    id="initial_tstep"
                    name="initial_tstep"
                    type="text"
                    autoComplete="off"
                    onInput={handleNumericInput}
                    value={initial_tstep}
                    onChange={handleInputChange}
                    placeholder="Please enter a floating point number"
                    className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="massint" className="block text-sm/6 font-medium text-gray-900">
                  massint
                </label>
                <div>
                  <input
                    id="massint"
                    name="massint"
                    type="text"
                    autoComplete="off"
                    onInput={handleNumericInput}
                    value={massint}
                    onChange={handleInputChange}
                    placeholder="Please enter a floating point number"
                    className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="saveint" className="block text-sm/6 font-medium text-gray-900">
                  saveint
                </label>
                <div>
                  <input
                    id="saveint"
                    name="saveint"
                    type="text"
                    autoComplete="off"
                    onInput={handleNumericInput}
                    value={saveint}
                    onChange={handleInputChange}
                    placeholder="Please enter a floating point number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pipeline System</h2>
              <label htmlFor="INP" className="block text-sm/6 font-medium text-gray-900">
                INP
              </label>
              <div className="col-span-full">
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto size-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="INP"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="INP" name="INP" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">INP File Please</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full ">
              <h2 className="text-lg font-semibold text-gray-900">SWMM</h2>
              <label htmlFor="INP" className="block text-sm/6 font-medium text-gray-900">
                INP
              </label>
              <div className="col-span-full">
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto size-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="INP"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="INP" name="INP" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">INP File Please</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6 bg-white py-2">
            <button type="button" className="text-sm font-semibold text-gray-900" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DataUpload
