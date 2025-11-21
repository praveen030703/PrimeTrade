import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../Api.js";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("primetrade_token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("primetrade_user", JSON.stringify(data.user));
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!user) return <p className="text-white">Loading...</p>;

  const formatDOB = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 card p-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-2 text-left">
          <h2 className="text-3xl font-semibold text-white">{user.name}</h2>
          <p className="text-sm font-medium text-blue-300">{user.role}</p>
          <p className="text-sm text-slate-400">{user.bio}</p>
        </div>
        <button
          onClick={() => navigate("/profile/edit")}
          className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-blue-600/40 transition hover:bg-blue-500"
        >
          Edit profile
        </button>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="card p-6">
          <h3 className="text-lg font-semibold text-white">
            Contact information
          </h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Email</dt>
              <dd className="font-medium text-white">{user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Phone</dt>
              <dd className="font-medium text-white">{user.mobile}</dd>
            </div>
          </dl>
        </article>

        <article className="card p-6">
          <h3 className="text-lg font-semibold text-white">Personal details</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Date of birth</dt>
              <dd className="font-medium text-white">{formatDOB(user.dob)}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Gender</dt>
              <dd className="font-medium text-white">{user.gender}</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
};

export default Profile;
