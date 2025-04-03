import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Typography,
    Button,
    Card,
    CardContent,
    Box,
    Pagination,
    Stack,
    Divider,
    IconButton,
    Link
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import AddPostModal from '../components/AddPostModal';
import EditPostModal from '../components/EditPostModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { fetchAllPosts, deletePost } from '../api';
import { Post } from '../types/interfaces';

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const postsPerPage = 10;

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchAllPosts();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        loadPosts();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const pageCount = Math.ceil(posts.length / postsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleAddPost = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    };

    const handleEditPost = (updatedPost: Post) => {
        setPosts(posts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        ));
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

    return (
        <Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Home Page
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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

            <Stack spacing={2}>
                {currentPosts.map((post) => (
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
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(post)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {post.body}
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Author: <Link component={RouterLink} to={`/authors/${post.userId}`}>User {post.userId}</Link>
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}
        </Box>
    );
};

export default HomePage;