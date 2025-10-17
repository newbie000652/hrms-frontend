import React from 'react';

const overlayClasses = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
const containerClasses = 'relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100';
const headerClasses = 'flex items-start justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4';
const titleClasses = 'text-xl font-semibold text-gray-900';
const closeButtonClasses = 'inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary-200';
const contentClasses = 'max-h-[calc(90vh-104px)] overflow-y-auto px-6 py-6';

const Modal = ({ title, children, onClose }) => {
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className={overlayClasses} onClick={handleOverlayClick}>
            <div className={containerClasses} role="dialog" aria-modal="true">
                <div className={headerClasses}>
                    <h2 className={titleClasses}>{title}</h2>
                    <button type="button" className={closeButtonClasses} onClick={onClose} aria-label="关闭">
                        ×
                    </button>
                </div>
                <div className={contentClasses}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
