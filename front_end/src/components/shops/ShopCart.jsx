import React, { useState, useEffect } from 'react';

const ShopCart = ({ addToCart, products }) => {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userID = localStorage.getItem('_id');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {products.length > 0 ? (  // Check if products exist before mapping
        products.map((product, index) => (
          <div className='box' key={index}>
            <div className='product mtop'>
              <div className='img'>
                {product.price_sale === 0 ? (
                  <span className='discount'>New</span>
                ) : (
                  <span className='discount'>{product.price_sale}% Off</span>
                )}
                <img src={`/images/shops/${product.image_preview}`} alt="" />
                <div className='product-like'>
                  <label>{count}</label> <br />
                  <i className='fa-regular fa-heart' onClick={increment}></i>
                  <br />
                  <a href={`/get_product/${product._id}`}>
                    info
                  </a>
                </div>
              </div>
              <div className='product-details'>
                <h3>{product.product_name}</h3>
                <div className='rate'>
                  <i className='fa fa-star'></i>
                  <i className='fa fa-star'></i>
                  <i className='fa fa-star'></i>
                  <i   
 className='fa fa-star'></i>
                  <i className='fa fa-star'></i>
                </div>
                <div className='price'>
                  <h4>{product.price.toLocaleString('vi-VN',   
 { minimumFractionDigits: 0 })} </h4>
                  {isLoggedIn && (
                    <button onClick={() => addToCart(product, userID)}>
                      <i className='fa fa-plus'></i>
                    </button>
                  )}
                </div>
                <div className='price'>
                  <h4>Stock: {product.stock} </h4>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </>
  );
};

export default ShopCart;