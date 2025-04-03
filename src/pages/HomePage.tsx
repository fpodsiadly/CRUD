import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <div className="container my-4">
            <h1 className="text-center mb-4">Home Page</h1>

            <div className="text-center mb-3">
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    Add New Post
                </button>
            </div>

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

            <ul className="list-group mb-4">
                {currentPosts.map((post) => (
                    <li key={post.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="h5 mb-0">{post.title}</h2>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditClick(post)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteClick(post)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <p>{post.body}</p>
                        <p className="mb-0">
                            Author: <Link to={`/authors/${post.userId}`}>User {post.userId}</Link>
                        </p>
                    </li>
                ))}
            </ul>

            {posts.length > postsPerPage && (
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default HomePage;