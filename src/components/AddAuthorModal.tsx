import React from 'react';
import './AddAuthorModal.css';

interface AddAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddAuthor: (author: { id: number; name: string; username: string; email: string }) => void;
}

const AddAuthorModal: React.FC<AddAuthorModalProps> = ({ isOpen, onClose, onAddAuthor }) => {
    if (!isOpen) return null;

    const handleAddAuthor = () => {
        const newAuthor = {
            id: Date.now(),
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
        };
        onAddAuthor(newAuthor);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Dodaj autora</h2>
                <div className="form-actions">
                    <button onClick={handleAddAuthor}>Dodaj autora</button>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
        </div>
    );
};

export default AddAuthorModal;