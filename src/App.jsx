import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import "./App.css";

const samplePosts = [
  {
    title: "Getting Started with React",
    author: "Rahul",
    content:
      "React helps developers build interactive user interfaces using reusable components.",
    tags: ["react", "javascript"],
  },
  {
    title: "Why Learn JavaScript",
    author: "Priya",
    content:
      "JavaScript makes websites interactive and is useful for frontend and backend development.",
    tags: ["javascript", "web"],
  },
  {
    title: "Introduction to HTML",
    author: "Amit",
    content:
      "HTML provides the basic structure of web pages using different elements and tags.",
    tags: ["html", "web"],
  },
  {
    title: "CSS Styling Basics",
    author: "Neha",
    content:
      "CSS is used to style web pages with colors, layouts, spacing, and responsive designs.",
    tags: ["css", "design"],
  },
  {
    title: "Understanding LocalStorage",
    author: "Rahul",
    content:
      "LocalStorage allows websites to save small amounts of data in the browser.",
    tags: ["javascript", "storage"],
  },
  {
    title: "Learning Python",
    author: "Priya",
    content:
      "Python is a beginner-friendly programming language used in web development and automation.",
    tags: ["python", "coding"],
  },
  {
    title: "Importance of GitHub",
    author: "Amit",
    content:
      "GitHub helps developers store code, track changes, and collaborate on projects.",
    tags: ["github", "git"],
  },
  {
    title: "Responsive Web Design",
    author: "Neha",
    content:
      "Responsive design helps websites work properly on mobile phones, tablets, and computers.",
    tags: ["css", "responsive"],
  },
  {
    title: "What Is an API",
    author: "Rahul",
    content:
      "An API allows different software applications to communicate and exchange data.",
    tags: ["api", "web"],
  },
  {
    title: "Tips for Coding Practice",
    author: "Priya",
    content:
      "Regular coding practice improves problem-solving skills and builds programming confidence.",
    tags: ["coding", "learning"],
  },
];

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 5;

  useEffect(() => {
    const savedPosts =
      JSON.parse(localStorage.getItem("posts")) || [];

    let updatedPosts = [...savedPosts];

    // Add sample posts only when fewer than 10 posts exist.
    if (updatedPosts.length < 10) {
      const needed = 10 - updatedPosts.length;
      const now = Date.now();

      const newPosts = samplePosts
        .slice(0, needed)
        .map((post, index) => ({
          ...post,
          id: now + index,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

      updatedPosts = [...updatedPosts, ...newPosts];

      localStorage.setItem(
        "posts",
        JSON.stringify(updatedPosts)
      );
    }

    setPosts(updatedPosts);
  }, []);

  const authors = [
    ...new Set(posts.map((post) => post.author)),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesAuthor =
      authorFilter === "" ||
      post.author === authorFilter;

    return matchesSearch && matchesAuthor;
  });

  const totalPages = Math.ceil(
    filteredPosts.length / postsPerPage
  );

  const startIndex = (currentPage - 1) * postsPerPage;

  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  function handleAuthor(e) {
    setAuthorFilter(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="container">
      <h1>Post Management System</h1>

      <Link to="/posts/new" className="create-btn">
        + Create Post
      </Link>

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

      <div className="posts">
        {currentPosts.map((post) => (
          <div className="post-card" key={post.id}>
            <h2>{post.title}</h2>

            <p className="author">
              Author: {post.author}
            </p>

            <p className="date">
              Created:{" "}
              {new Date(
                post.createdAt
              ).toLocaleDateString()}
            </p>

            <p className="content">
              {post.content.length > 120
                ? post.content.substring(0, 120) + "..."
                : post.content}
            </p>

            <p>
              Tags:{" "}
              {Array.isArray(post.tags)
                ? post.tags.join(", ")
                : post.tags}
            </p>

            <Link
              to={`/posts/${post.id}`}
              className="view-btn"
            >
              View Post
            </Link>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No posts found.
        </p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) => page - 1)
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
              setCurrentPage((page) => page + 1)
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
      <Route path="/" element={<Home />} />

      <Route
        path="/posts/new"
        element={<CreatePost />}
      />

      <Route
        path="/posts/:id"
        element={<PostDetails />}
      />

      <Route
        path="/posts/:id/edit"
        element={<EditPost />}
      />
    </Routes>
  );
}

export default App;
