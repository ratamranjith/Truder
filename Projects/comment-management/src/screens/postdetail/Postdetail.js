// PostDetail.js
import React from 'react';
import './Postdetail.css';
import { useLocation } from 'react-router-dom';

export default function PostDetail() {
  let { state } = useLocation();

  return (
    <div className="post-detail-container">
      {state && state.post ? (
        <div>
          <h2>{state.post.title}</h2>
          <p>{state.post.body}</p>
        </div>
      ) : (
        <p>No post details available.</p>
      )}
    </div>
  );
}

