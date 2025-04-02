import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddAuthorModal from '../components/AddAuthorModal';

// Define types for Author and Post
interface Author {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface Post {
    userId: number;
}

const AuthorsPage = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setAuthors(data));

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

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Autorzy</h1>
            <div className="text-center mb-3">
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    Dodaj autora
                </button>
            </div>
            <AddAuthorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddAuthor={handleAddAuthor}
            />
            <ul className="list-group">
                {authors.map((author) => (
                    <li key={author.id} className="list-group-item">
                        <h2 className="h5">{author.name}</h2>
                        <p>Username: {author.username}</p>
                        <p>Email: {author.email}</p>
                        <p>Liczba postów: {getPostCount(author.id)}</p>
                        <Link className="btn btn-link" to={`/authors/${author.id}`}>
                            Dowiedz się więcej
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuthorsPage;