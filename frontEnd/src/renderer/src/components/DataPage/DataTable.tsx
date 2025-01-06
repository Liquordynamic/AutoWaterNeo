import React from 'react'
import SectionHeading from '../ui/SectionHeading'
import { Switch } from "@renderer/components/ui/switch"
import { Button } from "@renderer/components/ui/button"

type DataTableProps = {
    isVisible: boolean;
    threeDTileAgreed: boolean;
    pipelineAgreed: boolean;
    floodingResultAgreed: boolean;
    showThreeDTilesLoading: boolean;
    onClose: () => void;
    setPipelineAgreed: (value: boolean) => void;
    setThreeDTileAgreed: (value: boolean) => void;
    setFloodingResultAgreed: (value: boolean) => void;
    setShowThreeDTilesLoading: (value: boolean) => void;
};

const DataTable: React.FC<DataTableProps> = ({
    isVisible, onClose,
    threeDTileAgreed, setThreeDTileAgreed,
    pipelineAgreed, setPipelineAgreed,
    floodingResultAgreed, setFloodingResultAgreed,
    setShowThreeDTilesLoading
}) => {

    const handlePipelineAgreed = (checked: boolean) => {
        setPipelineAgreed(checked);
    };
    const handleThreeDTileAgreedChange = (checked: boolean) => {
        setThreeDTileAgreed(checked);
        // setShowThreeDTilesLoading(checked);
    };
    const handleFloodingResultAgreedChange = (checked: boolean) => {
        setFloodingResultAgreed(checked);
    };

    if (!isVisible) return null;

    return (
        <>
            <div className='bg-white p-1 rounded-lg shadow-md absolute top-5 left-5 w-1/6 z-20 hidden sm:block'>
                <div className='bg-white p-4 w-full h-full overflow-auto'>
                    <form>
                        <div className='bg-cyan-100 rounded-lg p-1'>
                            <SectionHeading title='Display Table' subTitle='' />
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 pb-2">
                            <div className="col-span-full border-b border-gray-900/10 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Pipeline System</h2>
                                <div className="flex h-6 items-center justify-between">
                                    <p className="mt-1 text-sm text-gray-600">Show Pipeline Layer</p>
                                    <Switch
                                        id="airplane-mode"
                                        checked={pipelineAgreed}
                                        onCheckedChange={handlePipelineAgreed}
                                        className="group flex flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
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
                                        onCheckedChange={handleThreeDTileAgreedChange}
                                        className="group flex flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
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
                                        onCheckedChange={handleFloodingResultAgreedChange}
                                        className="group flex flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600 ml-auto"
                                    >
                                        <span className="sr-only">Agree to policies</span>
                                        <span
                                            aria-hidden="true"
                                            className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                                        />
                                    </Switch>
                                </div>
                                {/* <div className="flex h-6 items-center justify-between">
                                    <p className="mt-1 text-sm text-gray-600">Pause Water Flooding</p>
                                    <Button
                                        variant="ghost"
                                        className='mt-3 size-11 h-6' 
                                    >
                                        Pause
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <Button
                                variant="ghost"
                                type="button"
                                className="text-sm font-semibold text-gray-900 px-3"
                                onClick={onClose}
                                title="Cancel"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default DataTable
