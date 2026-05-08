import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";
import { useAuth } from "../stores/AuthStore";

function Home() {
  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.currentUser);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);

      try {
        let res = await axios.get(
          "https://blogapp-s4r1.onrender.com/user-api/articles",
          { withCredentials: true }
        );

       const latest = res.data.payload.sort(
          (firstArticle, secondArticle) =>new Date(secondArticle.createdAt) - new Date(firstArticle.createdAt)).slice(0, 3);
          setArticles(latest);
      } catch (err) {
        // setError(err.response?.data?.error || "Something went wrong");
  console.log("FULL ERROR:", err);
  setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div className="mt-4">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-2xl p-8 mb-6 shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-2">
          Welcome {currentUser?.firstName}
        </h1>

        <p className="text-lg opacity-90">
          Explore ideas, stories and insights...
        </p>
      </div>

<h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">
  Latest Articles
</h3>
      {/* ERROR STATE */}
      {error && (
        <p className={`${errorClass} mb-4`}>{error}</p>
      )}

      {/* EMPTY STATE */}
      {articles.length === 0 ? (
        <p className="text-[#a1a1a6] text-sm text-center py-10">No articles available yet</p>
      ) : (
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                {/* TOP */}
                <div>
                  <p className={articleTitle}>{articleObj.title}</p>

                  <p className="text-sm text-[#6e6e73] mt-1 break-words line-clamp-3 overflow-hidden">
                    {articleObj.content}
                  </p>
                  <p className={`${timestampClass} mt-2`}>{formatDateIST(articleObj.createdAt)}</p>
                </div>

                {/* ACTION */}
                <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => navigateToArticleByID(articleObj)}>
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
