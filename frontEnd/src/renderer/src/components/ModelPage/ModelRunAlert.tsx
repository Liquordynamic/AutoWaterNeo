import React, { useState, useEffect } from 'react'
import SectionHeading from '../ui/SectionHeading';

type ModelRunAlertProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ModelRunAlert: React.FC<ModelRunAlertProps> = ({ isVisible, onClose }) => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setSteps(prevSteps => prevSteps + 50);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className='bg-white/50 p-1 rounded-lg shadow-md absolute top-[37vh] left-[41.5vw] w-1/6 z-10 '>
      <div className='p-4 w-full h-full overflow-auto'>
        <form>
          <div className='bg-cyan-100 rounded-lg p-1'>
            <SectionHeading title='Model Running' subTitle='Please Waiting . . .' />
          </div>
          <div className="mt-4 flex flex-col justify-center items-center pb-2">
            <div className='text-white'>模型已运行{steps}步</div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-100"></div>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold text-white px-3"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModelRunAlert

