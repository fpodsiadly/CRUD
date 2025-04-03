import React, { useState } from 'react';
import './AddAuthorModal.css'; // Reusing modal styles

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            setIsDeleting(true);
            await onConfirm();
        } catch (error) {
            console.error('Error during deletion:', error);
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{title}</h2>
                <p className="confirmation-message">{message}</p>
                <div className="form-actions">
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="delete-button"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;