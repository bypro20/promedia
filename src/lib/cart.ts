export type CartItem = {
  serviceSlug: string
  serviceTitle: string
  tierId: string
  packageId: string
  amount: number
  price: number
  unit: string
}

const KEY = 'pm_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('pm-cart-updated'))
}

export function addToCart(item: CartItem) {
  const cart = getCart()
  cart.push(item)
  saveCart(cart)
}

export function removeFromCart(index: number) {
  const cart = getCart()
  cart.splice(index, 1)
  saveCart(cart)
}

export function clearCart() {
  saveCart([])
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price, 0)
}
