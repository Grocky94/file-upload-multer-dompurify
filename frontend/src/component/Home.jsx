import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

const Home = () => {
  const [product, setProductData] = useState({ name: "", price: "", description: "", image: null });
  const [uploadData, setUploadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://127.0.0.1:5000/");
        if (response.data.success) {
          setUploadData(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getData();
  }, [uploadData]);

  const handleTextField = (e) => {
    setProductData({ ...product, [e.target.name]: e.target.value });
  }

  const handleImageField = (e) => {
    setProductData({ ...product, ["image"]: e.target.files[0] });
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('image', product.image);

      const response = await axios.post("http://127.0.0.1:5000/upload", formData);

      if (response.data.success) {
        setMessage(response.data.message);
        setProductData({ name: "", price: "", description: "", image: null }); // Clear form
        setLoading(false);
      }
    } catch (err) {
      // Extract error message from the HTML response
      const errorMessage = err.response ? err.response.data.match(/<pre>([\s\S]*)<\/pre>/)[1] : "An error occurred while making the request.";
      setMessage(errorMessage);
      setLoading(false);
    }
  }


  return (
    <>
      <div className='App' style={{ marginTop: "3%", border: "1px solid black", width: "20%", height: "20vh" }}>
        <form onSubmit={formSubmit}>
          <input type="text" name='name' placeholder='Product Name' value={product.name} onChange={handleTextField} /><br />
          <input type="number" name='price' placeholder='Product Price' value={product.price} onChange={handleTextField} /><br />
          <input type="text" name='description' placeholder='Product Description' value={product.description} onChange={handleTextField} /><br />
          <input type='file' name='image' placeholder='Product Image' onChange={handleImageField} /><br />
          <input type="submit" value={loading ? "Adding..." : "Add Product"} disabled={loading} />
        </form>
        {message && (
          <div style={{ color: message.includes("success") ? 'green' : 'red' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
        )}
      </div>
      <div>
        {uploadData.map((product) => (
          <div key={product._id}>
            {/* Assuming 'image' is a Buffer field */}
            <img src={`data:${product.image.contentType};base64,${arrayBufferToBase64(product.image.data)}`} alt='image' />
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <p>Description: {product.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home;

// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
