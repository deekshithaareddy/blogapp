import { useEffect, useState } from "react";
import axios from "axios";

function AdminArticles() {
  // state to store all articles
  const [articles, setArticles] = useState([]);

  // state to store error message
  const [error, setError] = useState(null);
  const fetchArticles = async () => {
    try {
      const res = await axios.get(
        "https://blogapp-s4r1.onrender.com/admin-api/articles",
        {
          withCredentials: true,
        }
      );

      setArticles(res.data.payload || []);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message || "Failed to load articles"
      );
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

// block or unblock articles
  const toggleStatus = async (article) => {
    try {
      await axios.put(
        `https://blogapp-s4r1.onrender.com/admin-api/articles/${article._id}`,
        {
          isArticleActive: !article.isArticleActive,
        },
        {
          withCredentials: true,
        }
      );

      fetchArticles();
    } catch (err) {
      console.log(err);
    }
  };

  //delete articles
  const deleteArticle = async (id) => {
    try {
      // ask confirmation before delete
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this article?"
      );

      if (!confirmDelete) return;

      await axios.delete(
        `https://blogapp-s4r1.onrender.com/admin-api/articles/${id}`,
        {
          withCredentials: true,
        }
      );

      fetchArticles();
    } catch (err) {
      console.log(err);
    }
  };

  // show error if exists
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      {/* page heading */}
      <h2 className="text-xl font-bold mb-4">
        Manage Articles
      </h2>

      {/* if no articles */}
      {articles.length === 0 ? (
        <p>No articles found</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div
              key={article._id}
              className="p-4 border rounded-xl bg-white shadow-sm"
            >
              {/* title + status */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-lg">
                    {article.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {article.category}
                  </p>
                </div>

                {/* article active / blocked badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    article.isArticleActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {article.isArticleActive
                    ? "ACTIVE"
                    : "BLOCKED"}
                </span>
              </div>

              {/* short article content preview */}
              <p className="text-sm text-gray-600 mt-3">
                {article.content?.slice(0, 120)}...
              </p>

              {/* action buttons */}
              <div className="flex gap-3 mt-4">
                {/* block/unblock button */}
                <button
                  onClick={() => toggleStatus(article)}
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  {article.isArticleActive
                    ? "Block"
                    : "Unblock"}
                </button>

                {/* delete button */}
                <button
                  onClick={() => deleteArticle(article._id)}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminArticles;
