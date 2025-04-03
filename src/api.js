// api.js

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

// FETCH OPERATIONS
export const fetchAuthorDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch author details')
  }
  return response.json()
}

export const fetchPostsByAuthor = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts?userId=${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts by author')
  }
  return response.json()
}

export const fetchAllPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

export const fetchAllAuthors = async () => {
  const response = await fetch(`${API_BASE_URL}/users`)
  if (!response.ok) {
    throw new Error('Failed to fetch authors')
  }
  return response.json()
}

// CREATE OPERATIONS
export const createAuthor = async (authorData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authorData),
  })

  if (!response.ok) {
    throw new Error('Failed to create author')
  }

  return response.json()
}

export const createPost = async (postData) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  return response.json()
}

// UPDATE OPERATIONS
export const updateAuthor = async (id, authorData) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authorData),
  })

  if (!response.ok) {
    throw new Error('Failed to update author')
  }

  return response.json()
}

export const updatePost = async (id, postData) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })

  if (!response.ok) {
    throw new Error('Failed to update post')
  }

  return response.json()
}

// DELETE OPERATIONS
export const deleteAuthor = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete author')
  }

  return true // API returns 200 OK with an empty response
}

export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }

  return true // API returns 200 OK with an empty response
}
