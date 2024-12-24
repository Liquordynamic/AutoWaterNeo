import React, { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { Switch } from '@headlessui/react'

type DataTableProps = {
    isVisible: boolean;
    onClose: () => void;
};

const DataTable: React.FC<DataTableProps> = ({ isVisible, onClose }) => {

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
                        <div className="col-span-full">
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
                    </div>
                    <div className="flex items-center justify-end gap-x-6">
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
                <section className="bg-gray-2 py-[60px] dark:bg-dark">
                    <div className="mx-auto px-4 sm:container">
                        <div className="relative flex max-w-[422px] items-center rounded-lg border border-stroke bg-white p-4 py-[18px] shadow-pricing-4 sm:px-[30px] dark:border-dark-3 dark:bg-dark-2 dark:shadow-box-dark">
                            <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-full bg-green">
                                <svg
                                    width={24}
                                    height={25}
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 1.17499C5.7375 1.17499 0.675003 6.23749 0.675003 12.5C0.675003 18.7625 5.7375 23.8625 12 23.8625C18.2625 23.8625 23.3625 18.7625 23.3625 12.5C23.3625 6.23749 18.2625 1.17499 12 1.17499ZM12 22.175C6.675 22.175 2.3625 17.825 2.3625 12.5C2.3625 7.17499 6.675 2.86249 12 2.86249C17.325 2.86249 21.675 7.21249 21.675 12.5375C21.675 17.825 17.325 22.175 12 22.175Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M15.225 9.01248L10.7625 13.3625L8.7375 11.375C8.4 11.0375 7.875 11.075 7.5375 11.375C7.2 11.7125 7.2375 12.2375 7.5375 12.575L9.9375 14.9C10.1625 15.125 10.4625 15.2375 10.7625 15.2375C11.0625 15.2375 11.3625 15.125 11.5875 14.9L16.425 10.25C16.7625 9.91248 16.7625 9.38748 16.425 9.04998C16.0875 8.71248 15.5625 8.71248 15.225 9.01248Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <div className="flex w-full items-center justify-between">
                                <div>
                                    <h6 className="text-base font-semibold text-dark sm:text-lg dark:text-white">
                                        Congratulations
                                    </h6>
                                    <p className="text-sm text-body-color dark:text-dark-6">
                                        your message sent successfully
                                    </p>
                                </div>
                                <button className="text-dark-5 hover:text-red" title="Close">
                                    <svg
                                        width={18}
                                        height={18}
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="fill-current"
                                    >
                                        <path d="M9.9 9.00001L16.7625 2.13751C17.0156 1.88439 17.0156 1.49064 16.7625 1.23751C16.5094 0.984387 16.1156 0.984387 15.8625 1.23751L9 8.10001L2.1375 1.23751C1.88437 0.984387 1.49062 0.984387 1.2375 1.23751C0.984372 1.49064 0.984372 1.88439 1.2375 2.13751L8.1 9.00001L1.2375 15.8625C0.984372 16.1156 0.984372 16.5094 1.2375 16.7625C1.35 16.875 1.51875 16.9594 1.6875 16.9594C1.85625 16.9594 2.025 16.9031 2.1375 16.7625L9 9.90001L15.8625 16.7625C15.975 16.875 16.1437 16.9594 16.3125 16.9594C16.4812 16.9594 16.65 16.9031 16.7625 16.7625C17.0156 16.5094 17.0156 16.1156 16.7625 15.8625L9.9 9.00001Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DataTable;