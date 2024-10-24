"use client"
import React, { useEffect, useState } from "react"
import Alert from '../../components/ui/Alert'
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null)
  const router = useRouter()

  const pageTitle = 'SignUp';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const formHandler = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value })
  }

  const submitHandler = async e => {
    try {
      e.preventDefault()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          "Content-type": "application/json"
        }
      })

      const data = await res.json()
      if (data.error) {
        // const validationResult = parseErrorString(data.message);
        // setError(validationResult)
        setError(data.error)
        setTimeout(() => setError(null), 3000)
        return
      }

      setFormData({
        username: '',
        phone: '',
        email: '',
        password: ''
      })

      router.push("/verify/user_created")
    } catch (err) {
      setError("username must be unique!")
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center lg:justify-end bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/33.png')" }}
    >
      {error && <Alert message={error} closeHandler={() => setError(null)} />}
      {/* Background image for mobiles */}
      <div
        className="lg:hidden absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/login.png')" }}
      ></div>
      <div className="relative p-8 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-xl shadow-teal-800/80 onject-center">
        <h2 className="text-4xl font-bold mb-6 text-white text-center">
          Sign Up
        </h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-white">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Username"
              name="username"
              value={formData.username}
              onChange={(e) => formHandler(e)}
            />
            {error && error.username && <p>{error.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white">Phone Number</label>
            <input
              type="number"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Phone Number"
              name="phone"
              value={formData.phone}
              onChange={(e) => formHandler(e)}
            />
            {error && error.phone && <p>{error.phone}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Email"
              name="email"
              value={formData.email}
              onChange={(e) => formHandler(e)}
            />
            {error && error.email && <p>{error.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Password"
              name="password"
              value={formData.password}
              onChange={(e) => formHandler(e)}
            />
            {error && error.password && <p>{error.password}</p>}
          </div>
          <button
            className="bg-transparent hover:bg-teal-400 text-white hover:text-white font-bold py-2 px-4 rounded border border-white hover:border-transparent focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUpForm
