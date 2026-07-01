const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Enable cookies for credentials session transmission
  options.credentials = 'include';

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    const query = searchParams.toString();
    return fetchAPI(`/api/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => fetchAPI(`/api/products/${id}`),
  createProduct: (productData) => fetchAPI('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (id, productData) => fetchAPI(`/api/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (id) => fetchAPI(`/api/products/${id}`, {
    method: 'DELETE',
  }),
};
