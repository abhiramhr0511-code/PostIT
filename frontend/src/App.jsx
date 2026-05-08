
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://YOUR-RENDER-BACKEND.onrender.com";

export default function App() {
  const [page, setPage] = useState("home");
  const [reviews, setReviews] = useState([]);

  const [registerData, setRegisterData] = useState({
    username: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [adminData, setAdminData] = useState({
    username: "",
    password: ""
  });

  const [reviewForm, setReviewForm] = useState({
    username: "",
    location: "",
    review: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get(API + "/reviews");
    setReviews(res.data.reverse());
  };

  const register = async () => {
    const res = await axios.post(API + "/register", registerData);
    alert(res.data.message);
  };

  const login = async () => {
    const res = await axios.post(API + "/login", loginData);

    if (res.data.success) {
      alert("Login Successful");
      setReviewForm({
        ...reviewForm,
        username: loginData.username
      });
      setPage("user");
    } else {
      alert("Invalid Login");
    }
  };

  const adminLogin = async () => {
    const res = await axios.post(API + "/admin-login", adminData);

    if (res.data.success) {
      alert("Admin Login Successful");
      setPage("admin");
    } else {
      alert("Invalid Admin Login");
    }
  };

  const postReview = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("username", reviewForm.username);
    data.append("location", reviewForm.location);
    data.append("review", reviewForm.review);
    data.append("image", image);

    await axios.post(API + "/reviews", data);

    alert("Posted Successfully");

    setReviewForm({
      username: reviewForm.username,
      location: "",
      review: ""
    });

    fetchReviews();
  };

  if (page === "home") {
    return (
      <div className="container">
        <h1>🌍 PostIT</h1>

        <div className="card">
          <h2>User Register</h2>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                username: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password: e.target.value
              })
            }
          />

          <button onClick={register}>Register</button>
        </div>

        <div className="card">
          <h2>User Login</h2>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                username: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value
              })
            }
          />

          <button onClick={login}>Login</button>
        </div>

        <div className="card">
          <h2>Admin Login</h2>

          <input
            type="text"
            placeholder="Admin Username"
            onChange={(e) =>
              setAdminData({
                ...adminData,
                username: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Admin Password"
            onChange={(e) =>
              setAdminData({
                ...adminData,
                password: e.target.value
              })
            }
          />

          <button onClick={adminLogin}>Admin Login</button>
        </div>
      </div>
    );
  }

  if (page === "user") {
    return (
      <div className="container">
        <h1>Post Review</h1>

        <form className="card" onSubmit={postReview}>
          <input
            type="text"
            placeholder="Tourist Location"
            value={reviewForm.location}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                location: e.target.value
              })
            }
          />

          <textarea
            placeholder="Write Review"
            value={reviewForm.review}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                review: e.target.value
              })
            }
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit">Post Review</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="reviews">
        {reviews.map((r, index) => (
          <div className="card" key={index}>
            <img src={API + r.image} alt="" />
            <h3>{r.location}</h3>
            <p>{r.review}</p>
            <small>Posted by {r.username}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
