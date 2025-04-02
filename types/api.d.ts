declare module '../api' {
    export const fetchAuthorDetails: (id: string) => Promise<{ id: string; name: string; email: string; website: string }>;
    export const fetchPostsByAuthor: (id: string) => Promise<{ id: number; title: string; body: string; userId: string }[]>;
    export const fetchAllPosts: () => Promise<{ id: number; title: string; body: string; userId: string }[]>;
    export const fetchAllAuthors: () => Promise<{ id: number; name: string; username: string; email: string }[]>;
}