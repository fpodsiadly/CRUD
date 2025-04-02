// api.js

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

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
