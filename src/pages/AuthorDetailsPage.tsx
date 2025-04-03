import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Box,
    Link,
    CircularProgress,
    IconButton,
    Divider,
    Paper,
    Breadcrumbs,
    Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';

import {
    fetchAuthorDetails,
    fetchPostsByAuthor,
    deletePost
} from '../api';
import AddPostModal from '../components/AddPostModal';
import EditPostModal from '../components/EditPostModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Post, AuthorDetails } from '../types/interfaces';

const AuthorDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState<AuthorDetails | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const loadAuthorDetails = async () => {
            try {
                if (id) {
                    setLoading(true);
                    const authorData = await fetchAuthorDetails(id);
                    setAuthor(authorData);
                    const postsData = await fetchPostsByAuthor(id);
                    setPosts(postsData);
                }
            } catch (error) {
                console.error('Error fetching author details or posts:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAuthorDetails();
    }, [id]);

    const handleAddPost = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    };

    const handleEditPost = (updatedPost: Post) => {
        setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
    };

    const handleDeletePost = async () => {
        if (!selectedPost) return;
        try {
            await deletePost(selectedPost.id);
            setPosts(posts.filter(post => post.id !== selectedPost.id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEditClick = (post: Post) => {
        setSelectedPost(post);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (post: Post) => {
        setSelectedPost(post);
        setIsDeleteModalOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!author) {
        return (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h5" color="error">Author not found</Typography>
                <Button
                    component={RouterLink}
                    to="/authors"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 2 }}
                >
                    Back to Authors List
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box mb={3}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link component={RouterLink} to="/authors" underline="hover" color="inherit">
                        Authors
                    </Link>
                    <Typography color="text.primary">{author.name}</Typography>
                </Breadcrumbs>

                <Button
                    component={RouterLink}
                    to="/authors"
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    Back to Authors List
                </Button>

                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
                            {author.name.charAt(0)}
                        </Avatar>
                        <Typography variant="h4" component="h1">
                            {author.name}
                        </Typography>
                    </Box>

                    <Stack spacing={1} sx={{ ml: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body1">
                                {author.email}
                            </Typography>
                        </Box>

                        {author.website && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LanguageIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                <Link
                                    href={`http://${author.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {author.website}
                                </Link>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            </Box>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2">
                        Posts by {author.name}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add New Post
                    </Button>
                </Box>

                <AddPostModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAddPost={handleAddPost}
                />
                <EditPostModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onEditPost={handleEditPost}
                    post={selectedPost}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeletePost}
                    title="Delete Post"
                    message={`Are you sure you want to delete the post "${selectedPost?.title}"? This action cannot be undone.`}
                />

                {posts.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                        <Typography variant="body1" color="text.secondary">
                            This author doesn't have any posts yet.
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={2}>
                        {posts.map((post) => (
                            <Card key={post.id} variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6">{post.title}</Typography>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEditClick(post)}
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(post)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {post.body}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default AuthorDetailsPage;