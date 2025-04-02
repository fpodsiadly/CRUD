import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AuthorDetailsPage.css';

const AuthorDetailsPage = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState<{ name: string; email: string; website: string } | null>(null);
    const [posts, setPosts] = useState<{ id: number; title: string; body: string }[]>([]);

    useEffect(() => {
        // Fetch author details
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then((response) => response.json())
            .then((data) => setAuthor(data));

        // Fetch posts by the author
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
            .then((response) => response.json())
            .then((data) => setPosts(data));
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