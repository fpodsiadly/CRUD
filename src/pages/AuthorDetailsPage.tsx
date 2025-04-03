import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    fetchAuthorDetails,
    fetchPostsByAuthor,
    deletePost
} from '../api';
import AddPostModal from '../components/AddPostModal';
import EditPostModal from '../components/EditPostModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import './AuthorDetailsPage.css';
import { Post, AuthorDetails } from '../types/interfaces';

const AuthorDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState<AuthorDetails | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const loadAuthorDetails = async () => {
            try {
                if (id) {
                    const authorData = await fetchAuthorDetails(id);
                    setAuthor(authorData);
                    const postsData = await fetchPostsByAuthor(id);
                    setPosts(postsData);
                }
            } catch (error) {
                console.error('Error fetching author details or posts:', error);
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

    if (!author) {
        return <div className="loading">Loading author details...</div>;
    }

    return (
        <div className="author-details container my-4">
            <div className="author-header mb-4">
                <Link to="/authors" className="btn btn-secondary mb-3">
                    &larr; Back to Authors List
                </Link>
                <div className="author-info card p-4">
                    <h1>{author.name}</h1>
                    <p><strong>Email:</strong> {author.email}</p>
                    <p><strong>Website:</strong> <a href={`http://${author.website}`} target="_blank" rel="noopener noreferrer">{author.website}</a></p>
                </div>
            </div>

            <div className="author-posts">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Posts by {author.name}</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
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

                {posts.length === 0 ? (
                    <p>This author doesn't have any posts yet.</p>
                ) : (
                    <ul className="list-group">
                        {posts.map((post) => (
                            <li key={post.id} className="list-group-item post-item">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h3 className="h5">{post.title}</h3>
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
                                <p className="post-body">{post.body}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AuthorDetailsPage;