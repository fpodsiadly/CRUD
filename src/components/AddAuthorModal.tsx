import React, { useState } from 'react';
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

    const handleClose = () => {
        reset();
        setServerError(null);
        onClose();
    };

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
            setServerError('An error occurred while adding the author.');
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Add Author</DialogTitle>

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
                                id="name"
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
                                id="username"
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
                                id="email"
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
                                id="website"
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
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} />}
                >
                    {isSubmitting ? 'Adding...' : 'Add Author'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAuthorModal;