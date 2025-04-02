import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddPostModal from '../components/AddPostModal';
import { fetchAllPosts } from '../api';

// Define types for Post
interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleAddPost = (newPost: { title: string; body: string; userId: string }) => {
        const postWithId = { ...newPost, id: posts.length + 1, userId: Number(newPost.userId) };
        setPosts([postWithId, ...posts]);
    };

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Strona główna</h1>
            <div className="text-center mb-3">
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    Dodaj nowy post
                </button>
            </div>
            <AddPostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddPost={handleAddPost}
            />
            <ul className="list-group mb-4">
                {currentPosts.map((post) => (
                    <li key={post.id} className="list-group-item">
                        <h2 className="h5">{post.title}</h2>
                        <p>{post.body}</p>
                        <p>
                            Autor: <Link to={`/authors/${post.userId}`}>User {post.userId}</Link>
                        </p>
                    </li>
                ))}
            </ul>
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
                        <li key={i} className="page-item">
                            <button className="page-link" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default HomePage;