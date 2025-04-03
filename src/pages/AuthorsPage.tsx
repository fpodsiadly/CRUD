import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="container my-4">
            <h1 className="text-center mb-4">Authors</h1>

            <div className="text-center mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Author
                </button>
            </div>

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

            <ul className="list-group">
                {authors.map((author) => (
                    <li key={author.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="h5">{author.name}</h2>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditClick(author)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteClick(author)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <p>Username: {author.username}</p>
                        <p>Email: {author.email}</p>
                        <p>Number of posts: {getPostCount(author.id)}</p>
                        <Link className="btn btn-link" to={`/authors/${author.id}`}>
                            Learn more
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuthorsPage;