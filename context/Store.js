import { createContext, useContext, useState, useEffect } from 'react'
import { setLocalData, saveLocalData } from '@/utils/helpers'

const CartContext = createContext()
const AddToCartContext = createContext()
const UpdateCartQuantityContext = createContext()
const ClearCartContext = createContext()

export function useCartContext() {
  return useContext(CartContext)
}

export function useAddToCartContext() {
  return useContext(AddToCartContext)
}

export function useUpdateCartQuantityContext() {
  return useContext(UpdateCartQuantityContext)
}

export function useClearCartContext() {
  return useContext(ClearCartContext)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {
    setLocalData(setCart)
  }, [])

  useEffect(() => {
    // do this to make sure multiple tabs are always in sync
    const onReceiveMessage = (e) => {
      console.log(e)
      setLocalData(setCart)
    }

    window.addEventListener("storage", onReceiveMessage);
    return () => {
      window.removeEventListener("storage", onReceiveMessage);
    }
  }, [])

  async function addToCart(newItem) {
    setisLoading(true)
    
    // Create a unique key for the cart item (product + variant)
    const itemKey = `${newItem.productId}-${newItem.variantId || 'no-variant'}`
    
    // empty cart
    if (cart.length === 0) {
      setCart([
        ...cart,
        { ...newItem, itemKey }
      ])
      saveLocalData([{ ...newItem, itemKey }])

    } else {
      let newCart = [...cart]
      let itemAdded = false
      // loop through all cart items to check if product and variant
      // already exists and update quantity
      newCart.map(item => {
        const currentItemKey = `${item.productId}-${item.variantId || 'no-variant'}`
        if (currentItemKey === itemKey) {
          item.quantity += newItem.quantity
          itemAdded = true
        }
      })

      let newCartWithItem = [...newCart]
      if (itemAdded) {
      } else {
        // if its a new item than add it to the end
        newCartWithItem = [...newCart, { ...newItem, itemKey }]
      }

      setCart(newCartWithItem)
      saveLocalData(newCartWithItem)
    }
    setisLoading(false)
  }

  async function updateCartItemQuantity(itemKey, quantity) {
    setisLoading(true)
    let newQuantity = Math.floor(quantity)
    if (quantity === '') {
      newQuantity = ''
    }
    let newCart = [...cart]
    newCart.forEach(item => {
      const currentItemKey = `${item.productId}-${item.variantId || 'no-variant'}`
      if (currentItemKey === itemKey) {
        item.quantity = newQuantity
      }
    })

    // take out zeroes items
    newCart = newCart.filter(i => i.quantity !== 0)
    setCart(newCart)

    saveLocalData(newCart)
    setisLoading(false)
  }

  async function clearCart() {
    setisLoading(true)
    setCart([])
    saveLocalData([])
    setisLoading(false)
  }

  return (
    <CartContext.Provider value={[cart, isLoading]}>
      <AddToCartContext.Provider value={addToCart}>
        <UpdateCartQuantityContext.Provider value={updateCartItemQuantity}>
          <ClearCartContext.Provider value={clearCart}>
            {children}
          </ClearCartContext.Provider>
        </UpdateCartQuantityContext.Provider>
      </AddToCartContext.Provider>
    </CartContext.Provider>
  )
}
