import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

function Articles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAllArticles = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://blogapp-s4r1.onrender.com/user-api/articles"
        );

        if (res.status === 200||res.status === 304) {
          setArticles(res.data.payload);
          setAllArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAllArticles();
  }, []);

  const openArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  
  const handleSearch = async (value) => {
  setSearchText(value);
  // if input empty show all articles
  if (!value.trim()) {
    setArticles(allArticles);
    return;
  }
  try {
    const res = await axios.get(
      `https://blogapp-s4r1.onrender.com/user-api/search?keyword=${value}`
    );
    setArticles(res.data.payload);
  } catch (err) {
    console.log(err);
  }
};

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  if (error) {
    return <p className={errorClass}>{error}</p>;
  }

  if (articles.length === 0) {
    return (
      <p className="text-center text-[#6e6e73] py-10">
        No matching articles found.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-6">
        All Articles
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-2xl outline-none"
        />

      </div>

      <div className={articleGrid}>
        {articles.map((articleObj) => (
          <div
            key={articleObj._id}
            className={`${articleCardClass} flex flex-col`}
          >
            {/* STATUS */}
            <span
              className={
                articleObj.isArticleActive
                  ? articleStatusActive
                  : articleStatusDeleted
              }
            >
              {articleObj.isArticleActive ? "ACTIVE" : "DELETED"}
            </span>

            {/* CONTENT */}
            <div className="mt-3">
              <p className={articleTitle}>{articleObj.title}</p>

              <p className="text-sm text-[#6e6e73] mt-2 line-clamp-3 break-words">
                {articleObj.content}
              </p>

              <p className="text-xs text-[#86868b] mt-3">
                {formatDate(articleObj.createdAt)}
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => openArticle(articleObj)}
              className={`${ghostBtn} mt-auto pt-4`}
            >
              Read Article →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
