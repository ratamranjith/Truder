import React from "react";
import "./Post.css";
import { useNavigate } from "react-router-dom";

export default function Post({post}) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to post detail with state:", { post });
    navigate(`/post/${post.id}`, { state: { post } });
  };
  
  
  return (
    <div className="card" onClick={handleClick}>
      <div className="card-header">{post.title}</div>
      <div className="card-body text-success">
        <blockquote className="blockquote mb-0">
          <p>{post.body}</p>
        </blockquote>
      </div>
    </div>
  );
}