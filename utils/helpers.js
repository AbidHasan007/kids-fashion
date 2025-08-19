export function saveLocalData(cart) {
  localStorage.setItem('kids-fashion-cart', JSON.stringify(cart))
}

function getLocalData() {
  return JSON.parse(localStorage.getItem('kids-fashion-cart'))
}

export function setLocalData(setCart) {
  const localData = getLocalData()

  if (localData) {
    if (Array.isArray(localData)) {
      setCart([...localData])
    }
    else {
      setCart([localData])
    }
  }
}

export function getCartSubTotal(cart) {
  if (cart.length === 0) {
    return 0
  }
  else {
    let totalPrice = 0
    cart.forEach(item => totalPrice += parseInt(item.quantity) * parseFloat(item.price))
    return Math.round(totalPrice * 100) / 100
  }
}

export function getCartTotal(cart, shippingCost = 0) {
  const subtotal = getCartSubTotal(cart)
  return Math.round((subtotal + shippingCost) * 100) / 100
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(price)
}

export function generateOrderNumber() {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 1000)
  return `ORD-${timestamp}-${randomNum}`
}