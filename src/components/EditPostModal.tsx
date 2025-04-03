import React, { useState, useEffect, useCallback } from 'react';
import './AddPostModal.css'; // Reusing the same styles
import { updatePost, fetchAllAuthors } from '../api';
import { Author, Post } from '../types/interfaces';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditPost: (post: Post) => void;
    post: Post | null;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
    isOpen,
    onClose,
    onEditPost,
    post
}) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load authors - using useCallback
    const loadAuthors = useCallback(async () => {
        try {
            const data = await fetchAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error('Error loading authors:', error);
        }
    }, []);

    // Load authors when modal opens
    useEffect(() => {
        if (isOpen) {
            loadAuthors();
        }
    }, [isOpen, loadAuthors]);

    // Initialize form with post data when post changes
    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setBody(post.body);
            setUserId(post.userId.toString());
        }
    }, [post]);

    if (!isOpen || !post) return null;

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

            const postData = {
                title,
                body,
                userId: parseInt(userId)
            };

            // In a real app, we would use the API response
            // For JSONPlaceholder, we'll simulate the response
            const updatedPost: Post = {
                ...post,
                ...postData
            };

            // Call the API
            await updatePost(post.id, postData);

            onEditPost(updatedPost);
            setErrors({});

            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
            setErrors({ submit: 'An error occurred while updating the post.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Post</h2>

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
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;