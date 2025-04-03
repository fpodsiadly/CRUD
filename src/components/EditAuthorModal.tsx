import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './AddAuthorModal.css'; // Reusing the same styles
import { updateAuthor } from '../api';
import { Author } from '../types/interfaces';

interface EditAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditAuthor: (author: Author) => void;
    author: Author | null;
}

interface AuthorFormValues {
    name: string;
    username: string;
    email: string;
    website?: string;
}

const EditAuthorModal: React.FC<EditAuthorModalProps> = ({
    isOpen,
    onClose,
    onEditAuthor,
    author
}) => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<AuthorFormValues>({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            website: ''
        }
    });

    // Initialize form with author data when modal opens or author changes
    useEffect(() => {
        if (author) {
            reset({
                name: author.name || '',
                username: author.username || '',
                email: author.email || '',
                website: author.website || ''
            });
        }
    }, [author, reset]);

    if (!isOpen || !author) return null;

    const onSubmit = async (data: AuthorFormValues) => {
        try {
            // Prepare the data to be sent
            const authorData = {
                name: data.name,
                username: data.username,
                email: data.email,
                website: data.website || undefined
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
            onClose();
        } catch (error) {
            console.error('Error updating author:', error);
            setError('root.serverError', {
                type: 'manual',
                message: 'An error occurred while updating the author.'
            });
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Author</h2>
                {errors.root?.serverError && (
                    <div className="error-message">{errors.root.serverError.message}</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Name:<span className="required">*</span></label>
                        <input
                            type="text"
                            className={errors.name ? 'error' : ''}
                            {...register('name', {
                                required: 'Name is required'
                            })}
                        />
                        {errors.name && <div className="error-message">{errors.name.message}</div>}
                    </div>

                    <div className="form-group">
                        <label>Username:<span className="required">*</span></label>
                        <input
                            type="text"
                            className={errors.username ? 'error' : ''}
                            {...register('username', {
                                required: 'Username is required',
                                minLength: {
                                    value: 3,
                                    message: 'Username must be at least 3 characters'
                                }
                            })}
                        />
                        {errors.username && <div className="error-message">{errors.username.message}</div>}
                    </div>

                    <div className="form-group">
                        <label>Email:<span className="required">*</span></label>
                        <input
                            type="email"
                            className={errors.email ? 'error' : ''}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Please enter a valid email address'
                                }
                            })}
                        />
                        {errors.email && <div className="error-message">{errors.email.message}</div>}
                    </div>

                    <div className="form-group">
                        <label>Website:</label>
                        <input
                            type="text"
                            className={errors.website ? 'error' : ''}
                            placeholder="e.g. example.com"
                            {...register('website', {
                                pattern: {
                                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                    message: 'Please enter a valid website URL'
                                }
                            })}
                        />
                        {errors.website && <div className="error-message">{errors.website.message}</div>}
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

export default EditAuthorModal;