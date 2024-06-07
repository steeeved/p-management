import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

const Modal = ({ children, isOpen, onClose, name }: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
        <Header
          name={name}
          buttonComponent={
            <button
              className="text-blue-600 rounded-full px-3 py-1 flex items-center hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
              onClick={onClose}
            >
              X
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
