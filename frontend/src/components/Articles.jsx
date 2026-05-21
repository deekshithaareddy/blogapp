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
    <div className="mt-6 min-h-screen bg-[#f3f6fb] px-4 md:px-8 py-6">
      <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-6">
        All Articles
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border border-gray-200 bg-white px-5 py-3 rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-200"
        />

      </div>

      <div className="space-y-6">
  {articles.map((articleObj) => (
    <div
      key={articleObj._id}
      onClick={() => openArticle(articleObj)}
      className="
  bg-white
  rounded-3xl
  shadow-md
  hover:shadow-2xl
  transition-all
duration-300
hover:-translate-y-1
  cursor-pointer
  border
  border-gray-100
"
    >

      {/* CONTENT */}
      <div className="p-7 bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]">

        <div>

          <span className="text-xs uppercase tracking-wide text-orange-500 font-semibold">
            {articleObj.category}
          </span>

          <h2 className="text-3xl font-bold text-gray-900 mt-2 leading-tight line-clamp-2">
            {articleObj.title}
          </h2>

          <p className="text-gray-600 mt-4 leading-7 text-[15px] line-clamp-3">
            {articleObj.content}
          </p>

        </div>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-gray-800">
              {articleObj.author?.firstName}
            </p>

            <p className="text-xs text-gray-500">
              {formatDate(articleObj.createdAt)}
            </p>
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <span>❤️ {articleObj.likes?.length || 0}</span>
            <span>💬 {articleObj.comments?.length || 0}</span>
          </div>

        </div>

      </div>


    </div>
  ))}
</div>
      </div>
  );
}

export default Articles;
