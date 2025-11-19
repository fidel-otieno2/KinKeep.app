import React, { useState, useEffect } from 'react';
import InstagramLayout from '../components/InstagramLayout';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    // Mock products for family story preservation
    const mockProducts = [
      {
        id: 1,
        name: 'Custom Family Photo Book',
        price: 29.99,
        image: 'https://picsum.photos/300/300?random=1',
        category: 'books',
        seller: 'Memory Makers',
        rating: 4.8,
        reviews: 124
      },
      {
        id: 2,
        name: 'Digital Story Recording Kit',
        price: 89.99,
        image: 'https://picsum.photos/300/300?random=2',
        category: 'tech',
        seller: 'StoryTech',
        rating: 4.9,
        reviews: 67
      },
      {
        id: 3,
        name: 'Heritage Recipe Cards',
        price: 19.99,
        image: 'https://picsum.photos/300/300?random=3',
        category: 'stationery',
        seller: 'Family Traditions',
        rating: 4.7,
        reviews: 89
      },
      {
        id: 4,
        name: 'Ancestry DNA Kit',
        price: 99.99,
        image: 'https://picsum.photos/300/300?random=4',
        category: 'genealogy',
        seller: 'Heritage Labs',
        rating: 4.6,
        reviews: 203
      },
      {
        id: 5,
        name: 'Family Tree Wall Art',
        price: 45.99,
        image: 'https://picsum.photos/300/300?random=5',
        category: 'decor',
        seller: 'Artistic Memories',
        rating: 4.8,
        reviews: 156
      },
      {
        id: 6,
        name: 'Memory Preservation Box',
        price: 34.99,
        image: 'https://picsum.photos/300/300?random=6',
        category: 'storage',
        seller: 'Keepsake Co.',
        rating: 4.5,
        reviews: 78
      }
    ];

    const mockCategories = [
      { id: 'all', name: 'All Products', count: mockProducts.length },
      { id: 'books', name: 'Photo Books', count: 1 },
      { id: 'tech', name: 'Technology', count: 1 },
      { id: 'stationery', name: 'Stationery', count: 1 },
      { id: 'genealogy', name: 'Genealogy', count: 1 },
      { id: 'decor', name: 'Home Decor', count: 1 },
      { id: 'storage', name: 'Storage', count: 1 }
    ];

    setCategories(mockCategories);
    
    if (selectedCategory === 'all') {
      setProducts(mockProducts);
    } else {
      setProducts(mockProducts.filter(p => p.category === selectedCategory));
    }
    
    setLoading(false);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{product.seller}</p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
        </div>
        <p className="font-semibold text-lg">${product.price}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <InstagramLayout>
        <div className="max-w-6xl mx-auto pt-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 aspect-square rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </InstagramLayout>
    );
  }

  return (
    <InstagramLayout>
      <div className="max-w-6xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Family Heritage Shop</h1>
          <p className="text-gray-600">Discover products to preserve and celebrate your family stories</p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        <div className="instagram-gradient rounded-lg p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Preserve Your Family Legacy</h2>
            <p className="text-lg mb-6">
              Transform your digital stories into beautiful keepsakes with our curated collection 
              of family heritage products.
            </p>
            <button className="bg-white blue-accent px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Shop Featured Items
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">Premium materials for lasting memories</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Free delivery on orders over $50</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Family Approved</h3>
              <p className="text-sm text-gray-600">Trusted by thousands of families</p>
            </div>
          </div>
        </div>
      </div>
    </InstagramLayout>
  );
};

export default ShopPage;