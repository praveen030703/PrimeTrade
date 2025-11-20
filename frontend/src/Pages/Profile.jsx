import React from 'react'
import { useNavigate } from 'react-router-dom'

const user = {
  avatar: 'https://i.pravatar.cc/150?img=15',
  fullName: 'Jane Cooper',
  role: 'Operations Manager',
  email: 'jane.cooper@primetrade.com',
  phone: '+91 98765 43210',
  dob: '1992-07-18',
  gender: 'Female',
  address: '221B Baker Street, London',
  bio: 'Leading cross-functional teams to deliver impactful business outcomes.',
}

const Profile = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 card p-6 md:flex-row md:items-center">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover"
        />
        <div className="flex-1 space-y-2 text-left">
          <h2 className="text-3xl font-semibold text-white">{user.fullName}</h2>
          <p className="text-sm font-medium text-blue-300">{user.role}</p>
          <p className="text-sm text-slate-400">{user.bio}</p>
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-blue-600/40 transition hover:bg-blue-500"
        >
          Edit profile
        </button>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="card p-6">
          <h3 className="text-lg font-semibold text-white">Contact information</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Email</dt>
              <dd className="font-medium text-white">{user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Phone</dt>
              <dd className="font-medium text-white">{user.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Address</dt>
              <dd className="font-medium text-white">{user.address}</dd>
            </div>
          </dl>
        </article>

        <article className="card p-6">
          <h3 className="text-lg font-semibold text-white">Personal details</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Date of birth</dt>
              <dd className="font-medium text-white">{user.dob}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Gender</dt>
              <dd className="font-medium text-white">{user.gender}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Workspace ID</dt>
              <dd className="font-medium text-white">PT-2048</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  )
}

export default Profile
