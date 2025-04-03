import { useEffect, useState } from 'react'; // Removed unused React import
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Assuming types for posts and authors
interface Post {
    userId: number;
    // other properties of Post if needed
}

interface Author {
    id: number;
    name: string;
    // other properties of Author if needed
}

const StatisticsPage = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setAuthors(data));

        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    const getPostCount = (authorId: number) => { // Explicitly typed authorId
        return posts.filter((post: Post) => post.userId === authorId).length; // Explicitly typed post
    };

    const totalPosts = posts.length;
    const totalAuthors = authors.length;

    const chartData = {
        labels: authors.map((author: Author) => author.name), // Explicitly typed author
        datasets: [
            {
                label: 'Number of posts',
                data: authors.map((author: Author) => getPostCount(author.id)), // Explicitly typed author
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h1>Statistics</h1>
            <table>
                <thead>
                    <tr>
                        <th>Total number of posts</th>
                        <th>Total number of authors</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{totalPosts}</td>
                        <td>{totalAuthors}</td>
                    </tr>
                </tbody>
            </table>
            <h2>Posts per author</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default StatisticsPage;