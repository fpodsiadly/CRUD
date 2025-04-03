import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import './AddPostModal.css';
import { createPost, fetchAllAuthors } from '../api';
import { Author, Post, NewPost } from '../types/interfaces';

interface AddPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPost: (post: Post) => void;
}

interface PostFormValues {
    title: string;
    body: string;
    userId: string;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onAddPost }) => {
    const {
        register,
        handleSubmit,
        setValue,
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

    // Using useCallback for loadAuthors to prevent infinite rendering
    const loadAuthors = useCallback(async () => {
        try {
            const data = await fetchAllAuthors();
            setAuthors(data);
            // Auto-select the first author if exists
            if (data.length > 0) {
                setValue('userId', data[0].id.toString());
            }
        } catch (error) {
            console.error('Error loading authors:', error);
        }
    }, [setValue]);

    // Load authors when modal opens
    useEffect(() => {
        if (isOpen) {
            loadAuthors();
        }
    }, [isOpen, loadAuthors]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: PostFormValues) => {
        try {
            const postData: NewPost = {
                title: data.title,
                body: data.body,
                userId: parseInt(data.userId)
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

            // Reset form and close modal
            reset();
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            setError('root.serverError', {
                type: 'manual',
                message: 'An error occurred while adding the post.'
            });
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Post</h2>
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