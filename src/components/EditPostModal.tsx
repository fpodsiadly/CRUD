import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import './AddPostModal.css'; // Reusing the same styles
import { updatePost, fetchAllAuthors } from '../api';
import { Author, Post } from '../types/interfaces';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditPost: (post: Post) => void;
    post: Post | null;
}

interface PostFormValues {
    title: string;
    body: string;
    userId: string;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
    isOpen,
    onClose,
    onEditPost,
    post
}) => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<PostFormValues>({
        defaultValues: {
            title: '',
            body: '',
            userId: ''
        }
    });

    const [authors, setAuthors] = React.useState<Author[]>([]);

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
            reset({
                title: post.title,
                body: post.body,
                userId: post.userId.toString()
            });
        }
    }, [post, reset]);

    if (!isOpen || !post) return null;

    const onSubmit = async (data: PostFormValues) => {
        try {
            const postData = {
                title: data.title,
                body: data.body,
                userId: parseInt(data.userId)
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
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
            setError('root.serverError', {
                type: 'manual',
                message: 'An error occurred while updating the post.'
            });
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Post</h2>
                {errors.root?.serverError && (
                    <div className="error-message">{errors.root.serverError.message}</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Title:<span className="required">*</span></label>
                        <input
                            type="text"
                            className={errors.title ? 'error' : ''}
                            {...register('title', {
                                required: 'Title is required',
                                minLength: {
                                    value: 3,
                                    message: 'Title must be at least 3 characters'
                                }
                            })}
                        />
                        {errors.title && <div className="error-message">{errors.title.message}</div>}
                    </div>

                    <div className="form-group">
                        <label>Content:<span className="required">*</span></label>
                        <textarea
                            className={errors.body ? 'error' : ''}
                            rows={5}
                            {...register('body', {
                                required: 'Content is required',
                                minLength: {
                                    value: 10,
                                    message: 'Content must be at least 10 characters'
                                }
                            })}
                        ></textarea>
                        {errors.body && <div className="error-message">{errors.body.message}</div>}
                    </div>

                    <div className="form-group">
                        <label>Author:<span className="required">*</span></label>
                        <select
                            className={errors.userId ? 'error' : ''}
                            {...register('userId', {
                                required: 'Author selection is required'
                            })}
                        >
                            <option value="">Select author</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                        {errors.userId && <div className="error-message">{errors.userId.message}</div>}
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