import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";


const SignIn = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,  
    });
  };

  //sign in submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/signin", { ...formData });
      console.log(res);
      const data = res?.data;
      console.log(data);
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      {error && <p className="text-red-500 mt-5 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-t-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-t-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account ?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      
    </div>
  );
};

export default SignIn;
