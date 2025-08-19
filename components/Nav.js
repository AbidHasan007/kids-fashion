import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartContext } from '@/context/Store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

function Nav() {
  const cart = useCartContext()[0]
  const [cartItems, setCartItems] = useState(0)

  useEffect(() => {
    let numItems = 0
    cart.forEach(item => {
      numItems += item.quantity || 0
    })
    setCartItems(numItems)
  }, [cart])

  return (
    <header className="border-b border-palette-lighter sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-6xl px-6 py-1">
        <Link href="/" passHref>
          <a className="cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="flex items-center justify-items-center no-underline gap-0">
              <img 
                height="60" 
                width="60" 
                alt="Kids Fashion Store Logo" 
                className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain" 
                src="/icons.png" 
              />
              <span className="-ml-4 pt-2 text-lg md:text-xl lg:text-2xl font-primary font-bold text-palette-primary">
                KidsFashion
              </span>
            </h1>
          </a>
        </Link>
        <div>
          <Link
            href="/cart"
            passHref
          >
            <a className=" relative" aria-label="cart">
              <FontAwesomeIcon className="text-palette-primary w-6 md:w-6 lg:w-7 m-auto" icon={faShoppingCart} />
              {
                cartItems === 0 ?
                  null
                  :
                  <div
                    className="absolute top-0 right-0 text-xs bg-yellow-300 text-gray-900 font-semibold rounded-full py-1 px-2 transform translate-x-10 -translate-y-3"
                  >
                    {cartItems}
                  </div>
              }
            </a>
          </Link>
        </div>
      </div>
    </header >
  )
}

export default Nav
