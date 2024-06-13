// Modal.tsx
import React, { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Questions } from '../ExamModel';



interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions:number;
  answeredQuestions:number;
  answers:Questions[]
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose ,answeredQuestions,totalQuestions,answers}) => {
    const getMarks = () => {
        console.log(answers);
    }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto " onClose={onClose}>
        <div className="flex min-h-full items-center justify-center p-4 text-center ">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-100 p-6 text-left align-middle shadow-xl transition-all">
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You have attempted {answeredQuestions} out of {totalQuestions}.
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center mr-2 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={() => {onClose(),getMarks()}}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
