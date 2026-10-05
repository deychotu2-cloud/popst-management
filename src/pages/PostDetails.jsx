import { Link, useNavigate, useParams } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  const post = posts.find((item) => item.id === Number(id));

  if (!post) {
    return (
      <div className="container">
        <h1>Post Not Found</h1>

        <Link to="/" className="back-btn">
          ← Back to List
        </Link>
      </div>
    );
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    const updatedPosts = posts.filter(
      (item) => item.id !== Number(id)
    );

    localStorage.setItem(
      "posts",
      JSON.stringify(updatedPosts)
    );

    alert("Post deleted successfully!");

    navigate("/");
  }

  return (
    <div className="container">
      <div className="post-details">
        <h1>{post.title}</h1>

        <p className="author">
          Author: {post.author}
        </p>

        <p className="content">
          {post.content}
        </p>

        <div className="tags">
          {post.tags.map((tag, index) => (
            <span className="tag" key={index}>
              #{tag}
            </span>
          ))}
        </div>

        <p className="date">
          Created: {new Date(post.createdAt).toLocaleString()}
        </p>

        <p className="date">
          Updated: {new Date(post.updatedAt).toLocaleString()}
        </p>

        <div className="details-buttons">
          <Link
            to={`/posts/${post.id}/edit`}
            className="view-btn"
          >
            Edit Post
          </Link>

          <button
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete Post
          </button>
        </div>

        <Link to="/" className="back-btn">
          ← Back to List
        </Link>
      </div>
    </div>
  );
}

export default PostDetails;