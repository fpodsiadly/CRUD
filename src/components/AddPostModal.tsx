import React, { useState, useEffect, useCallback } from 'react';
import './AddPostModal.css';
import { createPost, fetchAllAuthors } from '../api';
import { Author, Post, NewPost } from '../types/interfaces';

interface AddPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPost: (post: Post) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onAddPost }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Using useCallback for loadAuthors to prevent infinite rendering
    const loadAuthors = useCallback(async () => {
        try {
            const data = await fetchAllAuthors();
            setAuthors(data);

            // Auto-select the first author if exists and none is selected
            if (data.length > 0 && !userId) {
                setUserId(data[0].id.toString());
            }
        } catch (error) {
            console.error('Error loading authors:', error);
        }
    }, [userId]);

    // Load authors when modal opens
    useEffect(() => {
        if (isOpen) {
            loadAuthors();
        }
    }, [isOpen, loadAuthors]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!body.trim()) {
            newErrors.body = 'Content is required';
        } else if (body.length < 10) {
            newErrors.body = 'Content must be at least 10 characters';
        }

        if (!userId) {
            newErrors.userId = 'Author selection is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            const postData: NewPost = {
                title,
                body,
                userId: parseInt(userId)
            };

            // In a real app, we would use the API response
            // For JSONPlaceholder, we'll simulate the response
            const newPost: Post = {
                id: Date.now(),
                ...postData
            };

            // Call the API
            await createPost(postData);

            onAddPost(newPost);

            // Reset form
            setTitle('');
            setBody('');
            setUserId('');
            setErrors({});

            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            setErrors({ submit: 'An error occurred while adding the post.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Post</h2>

                {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title:<span className="required">*</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <div className="error-message">{errors.title}</div>}
                    </div>

                    <div className="form-group">
                        <label>Content:<span className="required">*</span></label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className={errors.body ? 'error' : ''}
                            rows={5}
                        ></textarea>
                        {errors.body && <div className="error-message">{errors.body}</div>}
                    </div>

                    <div className="form-group">
                        <label>Author:<span className="required">*</span></label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className={errors.userId ? 'error' : ''}
                        >
                            <option value="">Select author</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                        {errors.userId && <div className="error-message">{errors.userId}</div>}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPostModal;