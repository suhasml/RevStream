import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CBadge } from '@coreui/react';
import axios from 'axios';
import './styles.css'; // Import your styles here

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8002/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <CSpinner color="primary" className="mt-3" />;
  }

  if (error) {
    return <div className="text-danger mt-3">{error}</div>;
  }

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Product Catalog</h4>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {products.map((product) => (
                <CCol xs="12" sm="6" md="4" lg="3" key={product.id} className="mb-4">
                  <CCard className="card-dark">
                    <CCardBody>
                      <div className="text-center text-black"> {/* Text color changed to black */}
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="img-fluid mb-2"
                          style={{ maxHeight: '150px', objectFit: 'cover' }}
                        />
                        <h5>{product.name}</h5>
                        <p>{product.description.substring(0, 50)}...</p>
                        <CBadge className="mb-2 price-badge text-black">${product.price}</CBadge>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ProductCatalog;
