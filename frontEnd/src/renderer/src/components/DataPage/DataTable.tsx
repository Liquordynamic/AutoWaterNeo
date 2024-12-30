import React, { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import { Switch } from '@headlessui/react'

type DataTableProps = {
    isVisible: boolean;
    onClose: () => void;
    threeDTileAgreed: boolean; 
    floodingResultAgreed: boolean;
    setThreeDTileAgreed: (value: boolean) => void; 
    setFloodingResultAgreed: (value: boolean) => void; 
};

const DataTable: React.FC<DataTableProps> = ({ isVisible, onClose, threeDTileAgreed, floodingResultAgreed, setThreeDTileAgreed, setFloodingResultAgreed }) => {

    const [demAgreed, setDemAgreed] = useState(false);
    const [pipelineAgreed, setPipelineAgreed] = useState(false);

    const handleThreeDTileAgreedChange = (checked: boolean) => {    
        setThreeDTileAgreed(checked);
        console.log(threeDTileAgreed);
    };
    const handleFloodingResultAgreedChange = (checked: boolean) => {    
        setFloodingResultAgreed(checked);
        console.log(floodingResultAgreed);
    };

    if (!isVisible) return null;

    return (
        <div className='bg-white p-1 rounded-lg shadow-md absolute top-5 left-5 w-1/5 z-10 hidden sm:block'>
            <div className='bg-white p-4 w-full h-full overflow-auto'>
                <form>
                    <div className='bg-cyan-100 rounded-lg p-1'>
                        <SectionHeading title='Data Table' subTitle='' />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 pb-2">
                        <div className="col-span-full border-b border-gray-900/10 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">DEM</h2>
                            <div className="flex h-6 items-center">
                                <p className="mt-1 text-sm text-gray-600">Show DEM</p>
                                <Switch
                                    checked={demAgreed}
                                    onChange={setDemAgreed}
                                    className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
                                >
                                    <span className="sr-only">Agree to policies</span>
                                    <span
                                        aria-hidden="true"
                                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                                    />
                                </Switch>
                            </div>
                        </div>
                        <div className="col-span-full border-b border-gray-900/10 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Pipeline System</h2>
                            <div className="flex h-6 items-center justify-between">
                                <p className="mt-1 text-sm text-gray-600">Show Pipeline Layer</p>
                                <Switch
                                    checked={pipelineAgreed}
                                    onChange={setPipelineAgreed}
                                    className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
                                >
                                    <span className="sr-only">Agree to policies</span>
                                    <span
                                        aria-hidden="true"
                                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                                    />
                                </Switch>
                            </div>
                        </div>
                        <div className="col-span-full border-b border-gray-900/10 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">3D Tile</h2>
                            <div className="flex h-6 items-center justify-between">
                                <p className="mt-1 text-sm text-gray-600">Show 3D Tiles</p>
                                <Switch
                                    checked={threeDTileAgreed}
                                    onChange={handleThreeDTileAgreedChange}
                                    className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
                                >
                                    <span className="sr-only">Agree to policies</span>
                                    <span
                                        aria-hidden="true"
                                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                                    />
                                </Switch>
                            </div>
                        </div>
                        <div className="col-span-full">
                            <h2 className="text-lg font-semibold text-gray-900">Water Flooding</h2>
                            <div className="flex h-6 items-center justify-between">
                                <p className="mt-1 text-sm text-gray-600">Show Water Flooding</p>
                                <Switch
                                    checked={floodingResultAgreed}
                                    onChange={handleFloodingResultAgreedChange}
                                    className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
                                >
                                    <span className="sr-only">Agree to policies</span>
                                    <span
                                        aria-hidden="true"
                                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                                    />
                                </Switch>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            className="text-sm font-semibold text-gray-900 px-3"
                            onClick={onClose}
                            title="Cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DataTable
