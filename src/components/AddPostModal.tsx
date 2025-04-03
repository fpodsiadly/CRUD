import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
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
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<PostFormValues>({
        defaultValues: {
            title: '',
            body: '',
            userId: ''
        }
    });

    const [authors, setAuthors] = React.useState<Author[]>([]);
    const [serverError, setServerError] = React.useState<string | null>(null);

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
            setServerError('Failed to load authors');
        }
    }, [setValue]);

    // Load authors when modal opens
    useEffect(() => {
        if (isOpen) {
            loadAuthors();
            setServerError(null);
        }
    }, [isOpen, loadAuthors]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset();
            setServerError(null);
        }
    }, [isOpen, reset]);

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
            setServerError('An error occurred while adding the post.');
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Add New Post</DialogTitle>

            <DialogContent>
                {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>
                )}

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{
                            required: 'Title is required',
                            minLength: {
                                value: 3,
                                message: 'Title must be at least 3 characters'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Title"
                                autoFocus
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />

                    <Controller
                        name="body"
                        control={control}
                        rules={{
                            required: 'Content is required',
                            minLength: {
                                value: 10,
                                message: 'Content must be at least 10 characters'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="body"
                                label="Content"
                                multiline
                                rows={5}
                                error={!!errors.body}
                                helperText={errors.body?.message}
                            />
                        )}
                    />

                    <Controller
                        name="userId"
                        control={control}
                        rules={{ required: 'Author selection is required' }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                margin="normal"
                                required
                                error={!!errors.userId}
                            >
                                <InputLabel id="author-select-label">Author</InputLabel>
                                <Select
                                    {...field}
                                    labelId="author-select-label"
                                    id="author-select"
                                    label="Author"
                                >
                                    {authors.map(author => (
                                        <MenuItem key={author.id} value={author.id}>
                                            {author.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.userId && (
                                    <FormHelperText>{errors.userId.message}</FormHelperText>
                                )}
                            </FormControl>
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
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} />}
                >
                    {isSubmitting ? 'Adding...' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPostModal;