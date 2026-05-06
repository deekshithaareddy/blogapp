import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
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

        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  return (
    <div>
      <h3>Latest Articles</h3>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {articles.length === 0 ? (
        <p>No articles available yet</p>
      ) : (
        <div>
          {articles.map((articleObj) => (
            <div key={articleObj._id}>
              <h4>{articleObj.title}</h4>
              <p>{articleObj.content}</p>
              <button>Read Article</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
