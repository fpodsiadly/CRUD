import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAuthorDetails, fetchPostsByAuthor } from '../api';
import './AuthorDetailsPage.css';

const AuthorDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [author, setAuthor] = useState<{ name: string; email: string; website: string } | null>(null);
    const [posts, setPosts] = useState<{ id: number; title: string; body: string }[]>([]);

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

    if (!author) {
        return <div className="loading">Loading author details...</div>;
    }

    return (
        <div className="author-details">
            <div className="author-info">
                <h1>{author.name}</h1>
                <p><strong>Email:</strong> {author.email}</p>
                <p><strong>Website:</strong> <a href={`http://${author.website}`} target="_blank" rel="noopener noreferrer">{author.website}</a></p>
            </div>

            <div className="author-posts">
                <h2>Posts by {author.name}</h2>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} className="post-item">
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AuthorDetailsPage;