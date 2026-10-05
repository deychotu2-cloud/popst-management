import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import "./App.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 5;

  useEffect(() => {
    const savedPosts =
      JSON.parse(localStorage.getItem("posts")) || [];

    setPosts(savedPosts);
  }, []);

  // Get unique authors
  const authors = [
    ...new Set(posts.map((post) => post.author)),
  ];

  // Search + Author Filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesAuthor =
      authorFilter === "" ||
      post.author === authorFilter;

    return matchesSearch && matchesAuthor;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredPosts.length / postsPerPage
  );

  const startIndex =
    (currentPage - 1) * postsPerPage;

  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // Search change
  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  // Author filter change
  function handleAuthor(e) {
    setAuthorFilter(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="container">
      <h1>Post Management System</h1>

      {/* Create Post */}
      <Link to="/posts/new" className="create-btn">
        + Create Post
      </Link>

      {/* Search and Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearch}
        />

        <select
          value={authorFilter}
          onChange={handleAuthor}
        >
          <option value="">All Authors</option>

          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      {/* Post List */}
      <div className="posts">
        {currentPosts.map((post) => (
          <div className="post-card" key={post.id}>
            
            {/* Title */}
            <h2>{post.title}</h2>

            {/* Author */}
            <p className="author">
              Author: {post.author}
            </p>

            {/* Created Date */}
            <p className="date">
              Created:{" "}
              {new Date(
                post.createdAt
              ).toLocaleDateString()}
            </p>

            {/* Short Content */}
            <p className="content">
              {post.content.length > 120
                ? post.content.substring(0, 120) + "..."
                : post.content}
            </p>

            {/* Tags */}
            <p>
              Tags:{" "}
              {Array.isArray(post.tags)
                ? post.tags.join(", ")
                : post.tags}
            </p>

            {/* View Post */}
            <Link
              to={`/posts/${post.id}`}
              className="view-btn"
            >
              View Post
            </Link>
          </div>
        ))}
      </div>

      {/* No Posts */}
      {filteredPosts.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No posts found.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            ← Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next →
          </button>

        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Create */}
      <Route
        path="/posts/new"
        element={<CreatePost />}
      />

      {/* Details */}
      <Route
        path="/posts/:id"
        element={<PostDetails />}
      />

      {/* Edit */}
      <Route
        path="/posts/:id/edit"
        element={<EditPost />}
      />

    </Routes>
  );
}

export default App;