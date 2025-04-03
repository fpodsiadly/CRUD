import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    Stack,
    IconButton,
    Chip,
    Avatar,
    Divider,
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import AddAuthorModal from '../components/AddAuthorModal';
import EditAuthorModal from '../components/EditAuthorModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { fetchAllAuthors, deleteAuthor } from '../api';
import { Author, Post } from '../types/interfaces';

const AuthorsPage = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const data = await fetchAllAuthors();
                setAuthors(data);
            } catch (error) {
                console.error('Error fetching authors:', error);
            }
        };
        loadAuthors();
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    const getPostCount = (authorId: number) => {
        return posts.filter((post: Post) => post.userId === authorId).length;
    };

    const handleAddAuthor = (newAuthor: Author) => {
        setAuthors([...authors, newAuthor]);
    };

    const handleEditAuthor = (updatedAuthor: Author) => {
        setAuthors(authors.map(author =>
            author.id === updatedAuthor.id ? updatedAuthor : author
        ));
    };

    const handleDeleteClick = (author: Author) => {
        setSelectedAuthor(author);
        setIsDeleteModalOpen(true);
    };

    const handleEditClick = (author: Author) => {
        setSelectedAuthor(author);
        setIsEditModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAuthor) return;
        try {
            await deleteAuthor(selectedAuthor.id);
            setAuthors(authors.filter(author => author.id !== selectedAuthor.id));
        } catch (error) {
            console.error('Error deleting author:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Authors
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Author
                </Button>
            </Box>

            <AddAuthorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddAuthor={handleAddAuthor}
            />

            <EditAuthorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onEditAuthor={handleEditAuthor}
                author={selectedAuthor}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Author"
                message={`Are you sure you want to delete author ${selectedAuthor?.name}? This action cannot be undone.`}
            />

            <Grid container spacing={3}>
                {authors.map((author) => (
                    <Grid item xs={12} sm={6} md={4} key={author.id}>
                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                                            {author.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="h6">{author.name}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditClick(author)}
                                            sx={{ mr: 0.5 }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(author)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Stack spacing={1.5}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Username: {author.username}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {author.email}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ArticleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                        <Chip
                                            label={`${getPostCount(author.id)} posts`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Stack>
                            </CardContent>

                            <Divider />

                            <CardActions>
                                <Button
                                    component={RouterLink}
                                    to={`/authors/${author.id}`}
                                    startIcon={<InfoIcon />}
                                    size="small"
                                    color="primary"
                                    fullWidth
                                >
                                    Learn more
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AuthorsPage;