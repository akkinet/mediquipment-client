'use client'
import { useContext, useState } from 'react'
import { CartContext } from '../SessionProVider'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import PrescriptionModal from './PrescriptionModal'
 
function Cart ({ isCartOpen, authSession }) {
  const myCart = typeof window !== 'undefined' && window.localStorage.getItem('medCart')
  // const authSession = typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem('nextUser'))
  const [cartItems, setCartItems] = useContext(CartContext)
  const [isModalOpen, setIsModalOpen] = useState(false) // For modal
  let cart = myCart ? JSON.parse(myCart) : [];
 
  const handleRemoveItem = async id => {
    cart = cart.filter(item => item.product_id != id)
 
    if (authSession) {
      await fetch(`/api/cart/${authSession.user.email}?product_id=${id}`, {
        method: 'DELETE'
      })
    }
    setCartItems(cartItems - 1)
    window.localStorage.setItem('medCart', JSON.stringify(cart))
  }
 
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
 
  const openModal = () => {
    setIsModalOpen(true)
  }
 
  if (!isCartOpen) return null
 
  return (
    <>
      {isCartOpen && (
        <div
          className={`absolute lg:-left-60 lg:top-16 sm: top-14 sm:!ml-0 sm: right-6 w-96 bg-white border-2 border-gray-200
                rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out text-black
              ${
                isCartOpen
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-8 opacity-0'
              }`}
        >
          <div className='p-4 max-h-72 overflow-auto'>
            <h3 className='text-lg font-semibold '>Cart</h3>
            {cart.length === 0 ? (
              <p className='text-sm text-gray-600'>Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between mt-4 cursor-pointer'
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className='h-16 w-16 rounded-lg object-contain border border-customBlue p-1'
                  />
                  <div className='flex flex-col flex-grow ml-4'>
                    <span className='text-md font-medium'>{item.title}</span>
                    <span className='text-sm font-bold text-gray-500'>
                      $
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}{' '}
                      x {item.quantity} = $
                      {(item.price * item.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className='border-none bg-red-500 text-white hover:text-gray-300 p-2 rounded-lg'
                  >
                    <RiDeleteBin6Fill size={22} />
                  </button>
                </div>
              ))
            )}
          </div>
 
          {cartItems > 0 && (
            <div className='px-4 py-2'>
              <div className='text-md font-semibold text-right'>
                Total: $
                {parseFloat(totalPrice).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <p className='text-xs text-gray-400'>
                  Above shown Price is excluding Tax
                </p>
              </div>
              <button
                className='mt-2 w-full bg-customBlue hover:bg-customPink text-white text-center rounded-lg cursor-pointer p-2'
                onClick={openModal}
              >
                Go To Checkout
              </button>
            </div>
          )}
        </div>
      )}
 
      {/* Independent Modal */}
      {isModalOpen && <PrescriptionModal
        cart={cart}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        email={authSession?.user.email}
      />}
    </>
  )
}
 
export default Cart