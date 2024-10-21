// Add this directive at the top
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reset = () => {
  const [password, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const pageTitle = 'Password Reset';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const submitHandler = async e => {
    try {
      e.preventDefault()
      if (password == '' || cPassword == '') {
        toast.error('fields are empty')
        return
      } else if (password !== cPassword) {
        toast.error('passwords ain\'t matching')
        return
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetpassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password })
      })

      router.push("/verify/passwordreset")
    } catch (err) {
      console.log("err", err)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-end bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dduiqwdtr/image/upload/f_auto,q_auto/v1/assets/1.png')" }}
    >
      <ToastContainer />
      {/* Background image for mobiles */}
      <div
        className="lg:hidden absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dduiqwdtr/image/upload/f_auto,q_auto/v1/assets/2.png')" }}
      ></div>
      <div className="relative p-8 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-xl shadow-teal-800/80 onject-center">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Reset Password
        </h2>
        <form className="w-full space-y-4" onSubmit={submitHandler}>
          <div className="flex flex-col mb-4">
            <label
              className="text-white text-sm font-bold"
              htmlFor="new-password"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="new-password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Enter your New Password"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              className="text-white text-sm font-bold"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              value={cPassword}
              onChange={({ target }) => setCPassword(target.value)}
              placeholder="Confirm your New Password"
            />
          </div>
          <div>
            <input
              className="bg-teal-500 shadow-inner  text-white hover:bg-white  hover:text-teal-500 font-bold py-2 px-4 rounded borderhover:border-transparent focus:outline-none focus:shadow-outline w-full"
              type="submit"
              value="Reset Password"
            />
          </div>
        </form>
        <div className="flex items-center justify-center mt-6">
          <Link className="inline-block align-baseline font-bold text-sm text-white hover:text-teal-600" href="/login">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Reset
