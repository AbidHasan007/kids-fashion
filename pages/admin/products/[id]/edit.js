import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'
import ImageUpload from '@/components/ImageUpload'
import withAuth from '@/components/withAuth'
import toast from 'react-hot-toast'

function EditProduct() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    handle: '',
    description: '',
    price: '',
    images: [],
    variants: []
  })

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id)
      const response = await fetch(`/api/products/${id}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const productData = await response.json()
        console.log('Product data:', productData)
        setProduct(productData)
        setFormData({
          title: productData.title || '',
          handle: productData.handle || '',
          description: productData.description || '',
          price: productData.price || '',
          images: productData.images || [],
          variants: productData.variants?.map(v => ({
            id: v.id,
            title: v.title || '',
            price: v.price || '',
            inventory: v.inventory || '',
            sku: v.sku || ''
          })) || []
        })
      } else {
        const errorData = await response.json()
        console.error('Product not found error:', errorData)
        toast.error('Product not found')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImagesChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }))
  }

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          title: '',
          price: '',
          inventory: '',
          sku: ''
        }
      ]
    }))
  }

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }))
  }

  const generateHandle = () => {
    const handle = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({
      ...prev,
      handle
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      console.log('Submitting product update for ID:', id)
      
      // Validate required fields
      if (!formData.title || !formData.handle || !formData.price) {
        toast.error('Please fill in all required fields')
        return
      }

      // Filter out empty variants
      const cleanVariants = formData.variants.filter(variant => 
        variant.title.trim() !== '' && variant.price !== '' && variant.price !== null && variant.price !== undefined
      )

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images,
        variants: cleanVariants.map(variant => ({
          ...variant,
          price: parseFloat(variant.price),
          inventory: parseInt(variant.inventory) || 0
        }))
      }

      console.log('Product data to update:', productData)

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      console.log('Update response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Update successful:', result)
        toast.success('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        console.error('Update failed:', error)
        toast.error(error.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
          <button
            onClick={() => router.push('/admin/products')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to Products
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Products
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Handle *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="product-handle"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateHandle}
                    className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              multiple={true}
            />
          </div>

          {/* Product Variants */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Variants</h2>
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant Title
                      </label>
                      <input
                        type="text"
                        value={variant.title}
                        onChange={(e) => handleVariantChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Small, Red, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (৳)
                      </label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inventory
                      </label>
                      <input
                        type="number"
                        value={variant.inventory}
                        onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="mt-3 text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove Variant
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Another Variant
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default withAuth(EditProduct)
