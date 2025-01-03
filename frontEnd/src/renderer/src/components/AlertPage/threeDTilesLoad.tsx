import React from 'react'
import SectionHeading from '../ui/SectionHeading';
import { Toaster } from "@renderer/components/ui/toaster"
import { useToast } from "@renderer/hooks/use-toast"
import { Button } from "@renderer/components/ui/button"
import { ToastAction } from "@renderer/components/ui/toast"

type threeDTilesLoadProps = {
  isVisible: boolean;
  onClose: () => void;
};

const threeDTilesLoad: React.FC<threeDTilesLoadProps> = ({ isVisible, onClose }) => {

  const { toast } = useToast()

  if (!isVisible) return null;

  // return (
  //   <>
  //     <div className="fixed inset-0 bg-black opacity-15 z-10"></div>
  //     <div className='bg-white/50 p-1 rounded-lg shadow-md absolute top-[33vh] left-[41.5vw] w-1/6 z-10 '>
  //       <div className='p-4 w-full h-full overflow-auto'>
  //         <form>
  //           <div className='bg-cyan-100 rounded-lg p-1'>
  //             <SectionHeading title='3DTiles Loading' subTitle='' />
  //           </div>
  //           <div className="mt-4 flex flex-col justify-center items-center pb-2">
  //             <div className='text-white'>Please Waiting</div>
  //             <div className="animate-spin rounded-full mt-4 h-16 w-16 border-t-4 border-b-4 border-cyan-100"></div>
  //           </div>
  //           <div className="flex items-center justify-end gap-x-6">
  //             {/* <button
  //               type="button"
  //               className="text-sm font-semibold text-white px-3"
  //               onClick={() => { onClose() }}
  //             >
  //               Cancel
  //             </button> */}
  //             <Button
  //               variant="outline"
  //               onClick={() => {
  //                 onClose()
  //                 toast({
  //                   variant: "destructive",
  //                   title: "Uh oh! Something went wrong.",
  //                   description: "There was a problem with your request.",
  //                   action: <ToastAction altText="Try again">Try again</ToastAction>,
  //                 })
  //               }}
  //             >
  //               Show Toast
  //             </Button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </>
  // )
}

export default threeDTilesLoad

