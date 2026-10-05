import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = posts.find((item) => item.id === Number(id));

  const [title, setTitle] = useState(post?.title || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");

  const [errors, setErrors] = useState({});

  if (!post) {
    return (
      <div className="container">
        <h1>Post Not Found</h1>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedPosts = posts.map((item) => {
      if (item.id === Number(id)) {
        return {
          ...item,
          title: title.trim(),
          author: author.trim(),
          content: content.trim(),
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
          updatedAt: new Date().toISOString(),
        };
      }

      return item;
    });

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    alert("Post updated successfully!");

    navigate(`/posts/${id}`);
  }

  return (
    <div className="container">
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />

        {errors.title && (
          <p className="error">{errors.title}</p>
        )}

        <label>Author</label>

        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
        />

        {errors.author && (
          <p className="error">{errors.author}</p>
        )}

        <label>Content</label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          placeholder="Write your post..."
        />

        {errors.content && (
          <p className="error">{errors.content}</p>
        )}

        <label>Tags</label>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, javascript, web"
        />

        <button type="submit">
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;