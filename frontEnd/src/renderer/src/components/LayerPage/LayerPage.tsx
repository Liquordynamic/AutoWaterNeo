import React from 'react';
import SectionHeading from '../ui/SectionHeading';
 
type LayerPageProps = {
    isVisible: boolean;
    onClose: () => void;
    steps: number;
};

const LayerPage: React.FC<LayerPageProps> = ({ isVisible, onClose, steps }) => {

    if (!isVisible) return null;

    return (
        <div className='bg-white p-1 rounded-lg shadow-md absolute top-5 left-5 bottom-10 w-1/6 z-10'>
            <div className='bg-white p-4 w-full h-full overflow-auto'>
                <form>
                    <div className='bg-cyan-100 rounded-lg p-1'>
                        <SectionHeading title='Layer Table' subTitle='' />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 pb-2">
                        <div className="col-span-full pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Layers</h2>
                            <div className="flex h-6 items-center">
                                <input type="checkbox" id="show-Layerx" className="mr-2" />
                                <label htmlFor="show-Layerx" className="mt-1 text-sm text-gray-600">Layer X</label>
                            </div>
                            {Array.from({ length: steps / 50 }).map((_, index) => (
                                <div key={index} className="flex h-6 items-center">
                                    <input type="checkbox" id={`layer-${index}`} className="mr-2" />
                                    <label htmlFor={`layer-${index}`} className="mt-1 text-sm text-gray-600">Layer {index + 1}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 bg-white py-2">
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