import React, { useState } from 'react';
import './AddPostModal.css';

interface AddPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPost: (post: { title: string; body: string; userId: string }) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onAddPost }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title && body && userId) {
            onAddPost({ title, body, userId });
            onClose();
        } else {
            alert('Wszystkie pola muszą być wypełnione!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Dodaj nowy post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tytuł:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Treść:</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Autor:</label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="">Wybierz autora</option>
                            <option value="1">User 1</option>
                            <option value="2">User 2</option>
                            <option value="3">User 3</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit">Dodaj</button>
                        <button type="button" onClick={onClose}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPostModal;