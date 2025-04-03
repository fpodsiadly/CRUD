import React, { useState, useEffect } from 'react';
import './AddAuthorModal.css'; // Reusing the same styles
import { updateAuthor } from '../api';
import { Author } from '../types/interfaces';

interface EditAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditAuthor: (author: Author) => void;
    author: Author | null;
}

const EditAuthorModal: React.FC<EditAuthorModalProps> = ({
    isOpen,
    onClose,
    onEditAuthor,
    author
}) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with author data when modal opens or author changes
    useEffect(() => {
        if (author) {
            setName(author.name || '');
            setUsername(author.username || '');
            setEmail(author.email || '');
            setWebsite(author.website || '');
        }
    }, [author]);

    if (!isOpen || !author) return null;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Fixed regex for URL validation without unnecessary escape characters
        if (website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
            newErrors.website = 'Please enter a valid website URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditAuthor = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // Prepare the data to be sent
            const authorData = {
                name,
                username,
                email,
                website: website || undefined
            };

            // In a real app, we would use the API response
            // For JSONPlaceholder, we'll simulate the response
            const updatedAuthor = {
                ...author,
                ...authorData
            };

            // Call the API
            await updateAuthor(author.id, authorData);

            onEditAuthor(updatedAuthor);
            setErrors({});

            onClose();
        } catch (error) {
            console.error('Error updating author:', error);
            setErrors({ submit: 'An error occurred while updating the author.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Author</h2>

                {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                )}

                <div className="form-group">
                    <label>Name:<span className="required">*</span></label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label>Username:<span className="required">*</span></label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <div className="error-message">{errors.username}</div>}
                </div>

                <div className="form-group">
                    <label>Email:<span className="required">*</span></label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                    <label>Website:</label>
                    <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className={errors.website ? 'error' : ''}
                        placeholder="e.g. example.com"
                    />
                    {errors.website && <div className="error-message">{errors.website}</div>}
                </div>

                <div className="form-actions">
                    <button
                        onClick={handleEditAuthor}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditAuthorModal;