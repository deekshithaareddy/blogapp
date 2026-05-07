import { useEffect, useState } from "react";
import axios from "axios";

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "https://blogapp-s4r1.onrender.com/admin-api/articles",
          { withCredentials: true }
        );

        setArticles(res.data.payload);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load articles");
      }
    };

    fetchArticles();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Articles</h2>

      {articles.length === 0 ? (
        <p>No articles found</p>
      ) : (
        <div className="grid gap-3">
          {articles.map((article) => (
            <div
              key={article._id}
              className="p-3 border rounded bg-white shadow-sm"
            >
              <p><b>Title:</b> {article.title}</p>
              <p><b>Category:</b> {article.category}</p>
              <p className="text-sm text-gray-600">
                {article.content?.slice(0, 120)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminArticles;
