import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    // State variables for storing products, loading state, and error messages
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect to fetch products with department and manufacturer details when the component is mounted
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Update the endpoint to use the new URL
                const response = await axios.get('http://localhost:8080/api/products/details');
                setProducts(response.data);  // Directly use response data if it’s a plain list
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Show loading message while data is being fetched
    if (loading) return <div>Loading...</div>;

    // Show error message if there is an error
    if (error) return <div>Error: {error}</div>;

    // Render the table with product data
    return (
        <div>
            <h2>Product List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Colour</th>
                        <th>Code</th>
                        <th>Quantity In Stock</th>
                        <th>Price</th>
                        <th>Department</th>
                        <th>Manufacturer</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.colour}</td>
                            <td>{product.code}</td>
                            <td>{product.quantityInStock}</td>
                            <td>{product.price}</td>
                            <td>{product.department ? product.department.name : "N/A"}</td>
                            <td>{product.manufacturer ? product.manufacturer.name : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
