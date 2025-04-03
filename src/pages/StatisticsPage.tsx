import { useEffect, useState } from 'react';
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
import {
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    CircularProgress,
    Grid
} from '@mui/material';

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
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [authorsResponse, postsResponse] = await Promise.all([
                    fetch('https://jsonplaceholder.typicode.com/users'),
                    fetch('https://jsonplaceholder.typicode.com/posts')
                ]);

                const authorsData = await authorsResponse.json();
                const postsData = await postsResponse.json();

                setAuthors(authorsData);
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getPostCount = (authorId: number) => {
        return posts.filter((post: Post) => post.userId === authorId).length;
    };

    const totalPosts = posts.length;
    const totalAuthors = authors.length;

    const chartData = {
        labels: authors.map((author: Author) => author.name),
        datasets: [
            {
                label: 'Number of posts',
                data: authors.map((author: Author) => getPostCount(author.id)),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Posts Distribution by Author',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Statistics
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Posts
                            </Typography>
                            <Typography variant="h3" color="primary" align="center">
                                {totalPosts}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Authors
                            </Typography>
                            <Typography variant="h3" color="secondary" align="center">
                                {totalAuthors}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Summary
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Total number of posts
                                </TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Total number of authors
                                </TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Average posts per author
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{totalPosts}</TableCell>
                                <TableCell>{totalAuthors}</TableCell>
                                <TableCell>
                                    {totalAuthors > 0 ? (totalPosts / totalAuthors).toFixed(2) : 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Posts per Author
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                    <Bar data={chartData} options={chartOptions} />
                </Box>
            </Paper>
        </Box>
    );
};

export default StatisticsPage;