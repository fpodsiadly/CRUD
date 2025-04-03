// Basic types used in the application

/**
 * Represents an author (user)
 */
export interface Author {
    id: number;
    name: string;
    username: string;
    email: string;
    website?: string;
}

/**
 * Represents a post
 */
export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

/**
 * Interface for detailed author data
 */
export interface AuthorDetails extends Author {
    website: string; // website is required in the details view
}

/**
 * Interface for a new post (without id)
 */
export interface NewPost {
    title: string;
    body: string;
    userId: number;
}

/**
 * Interface for a new author (without id)
 */
export interface NewAuthor {
    name: string;
    username: string;
    email: string;
    website?: string;
}


