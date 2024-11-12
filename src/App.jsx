import { useState, useEffect } from 'react';
import productServices from './services/products'; // Similar a personServices, pero para productos

const Heading = ({ text }) => <h2>{text}</h2>;

const Filter = ({ text, value, handleChange }) => (
  <div>
    {text} <input value={value} onChange={handleChange} />
  </div>
);

const Button = ({ type, text, handleClick }) => (
  <button type={type} onClick={handleClick}>{text}</button>
);

const ProductForm = ({ onSubmit, newProduct, handleNameChange, handlePriceChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      Product name: <input value={newProduct.name} onChange={handleNameChange} />
    </div>
    <div>
      Price: <input value={newProduct.price} onChange={handlePriceChange} />
    </div>
    <Button text="Add Product" type="submit" />
  </form>
);

const Product = ({ name, price, id, addToCart }) => (
  <li>
    {name} - ${price}
    <Button text="Add to Cart" handleClick={() => addToCart(id)} />
  </li>
);

const Cart = ({ cartItems, removeFromCart }) => (
  <ul>
    {cartItems.map(item => (
      <li key={item.id}>
        {item.name} - ${item.price}
        <Button text="Remove" handleClick={() => removeFromCart(item.id)} />
      </li>
    ))}
  </ul>
);

const Notification = ({ message }) => {
  if (!message) return null;
  return <div className="error">{message}</div>;
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [filterText, setFilterText] = useState('');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    productServices.getAll().then(initialProducts => setProducts(initialProducts));
  }, []);

  const handleAddProduct = event => {
    event.preventDefault();
    const product = { ...newProduct };

    productServices.create(product).then(returnedProduct => {
      setProducts(products.concat(returnedProduct));
      setNewProduct({ name: '', price: '' });
      setMessage(`Added ${product.name}`);
      setTimeout(() => setMessage(null), 5000);
    });
  };

  const addToCart = id => {
    const product = products.find(p => p.id === id);
    if (cart.find(item => item.id === id)) {
      setMessage(`${product.name} is already in the cart`);
    } else {
      setCart(cart.concat(product));
      setMessage(`${product.name} added to cart`);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const removeFromCart = id => {
    setCart(cart.filter(item => item.id !== id));
    setMessage(`Removed item from cart`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleNameChange = event => setNewProduct({ ...newProduct, name: event.target.value });
  const handlePriceChange = event => setNewProduct({ ...newProduct, price: event.target.value });
  const handleFilterChange = event => setFilterText(event.target.value);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <Heading text="E-commerce Store" />
      <Notification message={message} />

      <Filter text="Search Products:" value={filterText} handleChange={handleFilterChange} />

      <Heading text="Add a New Product" />
      <ProductForm
        onSubmit={handleAddProduct}
        newProduct={newProduct}
        handleNameChange={handleNameChange}
        handlePriceChange={handlePriceChange}
      />

      <Heading text="Available Products" />
      <ul>
        {filteredProducts.map(product => (
          <Product
            key={product.id}
            name={product.name}
            price={product.price}
            id={product.id}
            addToCart={addToCart}
          />
        ))}
      </ul>

      <Heading text="Shopping Cart" />
      <Cart cartItems={cart} removeFromCart={removeFromCart} />
    </div>
  );
};

export default App;
