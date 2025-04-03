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
        control,
        handleSubmit,
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

    // Load authors - using useCallback
    const loadAuthors = useCallback(async () => {
        try {
            const data = await fetchAllAuthors();
            setAuthors(data);
        } catch (error) {
            console.error('Error loading authors:', error);
            setServerError('Failed to load authors');
        }
    }, []);

    // Load authors when modal opens
    useEffect(() => {
        if (isOpen) {
            loadAuthors();
            setServerError(null);
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

    if (!post) return null;

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
            setServerError('An error occurred while updating the post.');
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Edit Post</DialogTitle>

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
                                <InputLabel id="edit-author-select-label">Author</InputLabel>
                                <Select
                                    {...field}
                                    labelId="edit-author-select-label"
                                    id="edit-author-select"
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

export default EditPostModal;