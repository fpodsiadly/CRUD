import React, { useState } from 'react';
import './AddAuthorModal.css';

interface AddAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddAuthor: (author: { id: number; name: string; username: string; email: string }) => void;
}

const AddAuthorModal: React.FC<AddAuthorModalProps> = ({ isOpen, onClose, onAddAuthor }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleAddAuthor = () => {
        const newAuthor = {
            id: Date.now(),
            name,
            username,
            email,
        };
        onAddAuthor(newAuthor);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Dodaj autora</h2>
                <div className="form-group">
                    <label>Imię:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Nazwa użytkownika:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-actions">
                    <button onClick={handleAddAuthor}>Dodaj autora</button>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
        </div>
    );
};

export default AddAuthorModal;