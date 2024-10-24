// Add this directive at the top
"use client"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { FaGoogle, FaFacebook, FaXTwitter } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { signIn } from 'next-auth/react'
import Alert from "../../components/ui/Alert"
import { CartContext } from "../../components/SessionProVider"

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState(null)
  const [, setCartItems] = useContext(CartContext)
  const router = useRouter()

  const pageTitle = 'Login';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const submitHandler = async e => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!result?.error) {
      const res = await fetch(`/api/user/info/${username}`)
      const dbUser = await res.json()
      window.localStorage.setItem("nextUser", JSON.stringify(dbUser))
      const resp = await fetch(`/api/cart/${dbUser.email}`)
      const myCart = await resp.json()
      setCartItems(myCart.length)
      window.localStorage.removeItem("medCart");
      window.localStorage.setItem("medCart", JSON.stringify(myCart))
      // Successfully signed in
      router.push("/"); // Redirect to the home page (or any other page)
      return
    }
    // Handle errors, e.g., display an error message to the user
    if (result?.error) {
      setErrMsg(result.error)
      setTimeout(() => {
        setErrMsg(null)
      }, 3000)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-end bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/login2.png')" }}
    >
      {errMsg && <Alert message={errMsg} closeHandler={() => setErrMsg(null)} />}
      {/* Background image for mobiles */}
      <div
        className="lg:hidden absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/login.png')" }}
      ></div>
      <div className="relative p-8 mx-8 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-xl shadow-teal-800/80 onject-center">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Log in
        </h2>
        <form className="w-full space-y-4" onSubmit={submitHandler}>
          <div className="flex flex-col mb-4">
            <label className="text-white text-sm font-bold" htmlFor="email">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              onChange={({ target }) => setUsername(target.value)}
              placeholder="Enter your Username"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-white text-sm font-bold" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Enter your Password"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label
              className="flex items-center text-white text-sm font-bold"
              htmlFor="remember"
            >
              <input
                className="mr-2 h-8 w-6 leading-tight"
                type="checkbox"
                id="remember"
              />
              <span className="text-white text-sm">Remember me?</span>
            </label>
          </div>
          <div>
            <input
              className="bg-transparent hover:bg-teal-400 text-white hover:text-white font-bold py-2 px-4 rounded border border-white hover:border-transparent focus:outline-none focus:shadow-outline w-full"
              type="submit"
              value="Log in"
            />
            <Link
              className="inline-block align-baseline font-bold text-sm text-white hover:text-teal-600"
              href="/password-forget"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mt-2 text-white">
          <div className="w-full flex items-center justify-center text-white my-4">
            <div className="flex-grow border-t border-white"></div>
            <span className="px-4">or</span>
            <div className="flex-grow border-t border-white"></div>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="flex items-center justify-center mt-5 space-x-3">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold p-3 rounded-full border border-gray-400 shadow flex items-center"
            type="button"
            onClick={() => signIn("google")}
          >
            <FaGoogle size={20} color="#DB4437" />
          </button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold p-3 rounded-full border border-gray-400 shadow flex items-center"
            type="button"
            onClick={() => signIn("facebook")}
          >
            <FaFacebook size={20} color="#1877F2" />
          </button>
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold p-3 rounded-full border border-gray-400 shadow flex items-center"
            type="button"
            onClick={() => signIn("twitter")}
          >
            <FaXTwitter size={20} color="#1DA1F2" />
          </button>
        </div>

        {/* Sign up link */}
        <div className="flex items-center justify-center mt-6">
          <Link className="inline-block align-baseline font-bold text-sm text-white hover:text-teal-600" href="/sign-up">
            Need an account? SIGN UP
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login