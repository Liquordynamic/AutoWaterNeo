import React, { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { Switch } from '@headlessui/react'

type LayerPageProps = {
    isVisible: boolean;
    onClose: () => void;
};

const LayerPage: React.FC<LayerPageProps> = ({ isVisible, onClose }) => {

    const [demAgreed, setDemAgreed] = useState(false);
    const [pipelineAgreed, setPipelineAgreed] = useState(false);

    if (!isVisible) return null;

    return (
        <div className='bg-white p-1 rounded-lg shadow-md absolute top-5 left-5 w-1/6 z-10 '>
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
                            </div>
                        </div>
                        <div className="col-span-full">
                            <h2 className="text-lg font-semibold text-gray-900">Pipeline System</h2>
                            <div className="flex h-6 items-center">
                                <p className="mt-1 text-sm text-gray-600">Show Pipeline</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            className="text-sm font-semibold text-gray-900 px-3"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default LayerPage;