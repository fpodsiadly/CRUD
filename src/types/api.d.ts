// Module declaration for API functions
declare module '../api' {
    // Direct use of types defined above
    
    // GET operations
    export const fetchAuthorDetails: (id: string) => Promise<AuthorDetails>;
    export const fetchPostsByAuthor: (id: string) => Promise<Post[]>;
    export const fetchAllPosts: () => Promise<Post[]>;
    export const fetchAllAuthors: () => Promise<Author[]>;
    
    // CREATE operations
    export const createAuthor: (authorData: NewAuthor) => Promise<Author>;
    export const createPost: (postData: NewPost) => Promise<Post>;
    
    // UPDATE operations
    export const updateAuthor: (id: number, authorData: Partial<Author>) => Promise<Author>;
    export const updatePost: (id: number, postData: Partial<Post>) => Promise<Post>;
    
    // DELETE operations
    export const deleteAuthor: (id: number) => Promise<boolean>;
    export const deletePost: (id: number) => Promise<boolean>;
}
