import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
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
        control,
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

    const [serverError, setServerError] = useState<string | null>(null);

    // Initialize form with author data when modal opens or author changes
    useEffect(() => {
        if (author) {
            reset({
                name: author.name || '',
                username: author.username || '',
                email: author.email || '',
                website: author.website || ''
            });
            setServerError(null);
        }
    }, [author, reset]);

    if (!author) return null;

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
            setServerError('An error occurred while updating the author.');
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Edit Author</DialogTitle>

            <DialogContent>
                {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>
                )}

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Name is required'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="edit-name"
                                label="Name"
                                autoFocus
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name="username"
                        control={control}
                        rules={{
                            required: 'Username is required',
                            minLength: {
                                value: 3,
                                message: 'Username must be at least 3 characters'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="edit-username"
                                label="Username"
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Please enter a valid email address'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="edit-email"
                                label="Email"
                                type="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        name="website"
                        control={control}
                        rules={{
                            pattern: {
                                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                message: 'Please enter a valid website URL'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                id="edit-website"
                                label="Website"
                                placeholder="e.g. example.com"
                                error={!!errors.website}
                                helperText={errors.website?.message}
                            />
                        )}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} />}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAuthorModal;