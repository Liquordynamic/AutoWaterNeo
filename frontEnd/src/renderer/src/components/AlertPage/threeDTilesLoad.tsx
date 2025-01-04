import React from 'react'
import SectionHeading from '../ui/SectionHeading';
import { toast } from 'sonner';
import { Button } from "@renderer/components/ui/button"

type threeDTilesLoadProps = {
  isVisible: boolean;
  onClose: () => void;
};

const threeDTilesLoad: React.FC<threeDTilesLoadProps> = ({ isVisible, onClose }) => {

  if (!isVisible) return null;

  const handleCancel = () => {
    toast('Loading cancelled.', {
      description: 'You have cancelled the 3DTiles loading process.',
      action: {
        label: 'Undo',
        onClick: () => toast('Undo action triggered!')
      }
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-15 z-10"></div>
      <div className='bg-white/50 p-1 rounded-lg shadow-md absolute top-[33vh] left-[41.5vw] w-1/6 z-10 '>
        <div className='p-4 w-full h-full overflow-auto'>
          <form>
            <div className='bg-cyan-100 rounded-lg p-1'>
              <SectionHeading title='3DTiles Loading' subTitle='' />
            </div>
            <div className="mt-4 flex flex-col justify-center items-center pb-2">
              <div className='text-white'>Please Waiting</div>
              <div className="animate-spin rounded-full mt-4 h-16 w-16 border-t-4 border-b-4 border-cyan-100"></div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default threeDTilesLoad
