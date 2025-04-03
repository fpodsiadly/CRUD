import React from 'react';
import { useForm } from 'react-hook-form';
import './AddAuthorModal.css';
import { createAuthor } from '../api';
import { Author, NewAuthor } from '../types/interfaces';

interface AddAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddAuthor: (author: Author) => void;
}

interface AuthorFormValues {
    name: string;
    username: string;
    email: string;
    website?: string;
}

const AddAuthorModal: React.FC<AddAuthorModalProps> = ({ isOpen, onClose, onAddAuthor }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<AuthorFormValues>({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            website: ''
        }
    });

    if (!isOpen) return null;

    const onSubmit = async (data: AuthorFormValues) => {
        try {
            // Prepare the data to be sent
            const authorData: NewAuthor = {
                name: data.name,
                username: data.username,
                email: data.email,
                website: data.website || undefined
            };

            // In a real app, we would use the API response
            // For JSONPlaceholder, we'll simulate the response because it doesn't actually create data
            const newAuthor: Author = {
                id: Date.now(), // Simulate ID generation
                ...authorData
            };

            // Call the API
            await createAuthor(authorData);
            onAddAuthor(newAuthor);

            // Reset form
            reset();
            onClose();
        } catch (error) {
            console.error('Error creating author:', error);
            // Błąd można obsłużyć za pomocą setError z react-hook-form
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Author</h2>
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
                            {isSubmitting ? 'Adding...' : 'Add Author'}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAuthorModal;