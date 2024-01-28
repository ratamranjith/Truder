import React, { useEffect, useState } from 'react'
import './Home.css'
import Post from '../../components/post/Post'
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {

      const fetchPost = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const jsonResponse = await response.json();
        if(response.ok){
          setPosts(jsonResponse)
          setError('')
        }
        if(!response.ok){
          setError(jsonResponse.error)
        }
      }
      fetchPost();

  },[])
  return (
    <div className='container'>
      {
        posts && posts.map((post) => {
          return <Post post={post} key={post.id}/>
        })
      }
      {
        error && <h3>{error}</h3>
      }
    </div>
  )
}