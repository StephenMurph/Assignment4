import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    // State variables for products, loading, errors, form inputs, and editing
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        colour: '',
        code: '',
        quantityInStock: 0,
        price: 0,
        department: 1, // Default link to department
        manufacturer: 1 // Default link to manufacturer
    });
    const [editProduct, setEditProduct] = useState(null);  // Holds the product being edited
    const [formError, setFormError] = useState('');

    // Function to fetch products
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            setProducts(response.data._embedded.products);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle input changes for both Create and Edit forms
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Convert specific fields to numbers
        if (name === 'quantityInStock' || name === 'price') {
            setNewProduct((prev) => ({
                ...prev,
                [name]: Number(value)
            }));
        } else {
            setNewProduct((prev) => ({
                ...prev,
                [name]: value
            }));
        }

        if (editProduct) {
            setEditProduct((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Create new product
    const handleCreateProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.code) {
            setFormError('Name, description, and code are required.');
            return;
        }

        console.log('Product Data being sent:', newProduct); // Log data to inspect

        // Construct the full URLs for department and manufacturer
        const departmentUrl = `http://localhost:8080/api/department/${newProduct.department}`;
        const manufacturerUrl = `http://localhost:8080/api/manufacturer/${newProduct.manufacturer}`;

        // Update newProduct with full URIs
        const productWithUris = {
            ...newProduct,
            department: departmentUrl,
            manufacturer: manufacturerUrl
        };

        try {
            await axios.post('http://localhost:8080/api/products', productWithUris);

            // Re-fetch the products list
            fetchProducts();

            // Hide the create form by resetting the 'newProduct' state
            setNewProduct({
                name: '',
                description: '',
                colour: '',
                code: '',
                quantityInStock: 0,
                price: 0,
                department: 1,  // Default link to department
                manufacturer: 1 // Default link to manufacturer
            });

            setFormError('');  // Reset any form error
            // Hide the create form (you could use a state flag or simple CSS toggle)
            document.getElementById('create-form').style.display = 'none';

        } catch (err) {
            setError(err.message);
            // Log the complete error response to get more details
            console.error('Error creating product:', err.response ? err.response.data : err);
        }
    };

    // Edit product
    const handleEditProduct = (product) => {
        const id = product._links?.self?.href?.split('/').pop();
        if (!id) {
            setFormError('Product ID is missing.');
            return;
        }

        setEditProduct({
            ...product,
            id: id
        });
    };

    // Update product
    const handleUpdateProduct = async () => {
        if (!editProduct || !editProduct.id) {
            setFormError('Product ID is missing.');
            return;
        }

        if (!editProduct.name || !editProduct.description || !editProduct.code) {
            setFormError('Name, description, and code are required.');
            return;
        }

        try {
            const putRequestUrl = `http://localhost:8080/api/products/${editProduct.id}`;
            await axios.put(putRequestUrl, {
                name: editProduct.name,
                description: editProduct.description,
                colour: editProduct.colour,
                code: editProduct.code,
                quantityInStock: editProduct.quantityInStock,
                price: editProduct.price,
                department: editProduct.department,
                manufacturer: editProduct.manufacturer
            });

            // Re-fetch the products list
            fetchProducts();

            // Reset the form
            setEditProduct(null);
            setFormError('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete product
    const deleteProduct = async (product) => {
        const id = product._links?.self?.href?.split('/').pop();
        if (!id) {
            setFormError('Product ID is missing.');
            return;
        }

        try {
            // Send the DELETE request
            await axios.delete(`http://localhost:8080/api/products/${id}`);

            // Re-fetch the products list after deletion
            fetchProducts();

        } catch (err) {
            setError(err.message);
        }
    };

    // Show loading state
    if (loading) return <div>Loading...</div>;

    // Show error message
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Product List</h2>

            <button onClick={() => document.getElementById('create-form').style.display = 'block'}>
                Create Product
            </button>

            {/* Create Product Form */}
            <div id="create-form" style={{ display: 'none', marginTop: '20px' }}>
                <h3>Create New Product</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateProduct();
                    }}
                >
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Colour:</label>
                        <input
                            type="text"
                            name="colour"
                            value={newProduct.colour}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Code:</label>
                        <input
                            type="text"
                            name="code"
                            value={newProduct.code}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Quantity In Stock:</label>
                        <input
                            type="number"
                            name="quantityInStock"
                            value={newProduct.quantityInStock}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                        />
                    </div>
                    {formError && <div style={{ color: 'red' }}>{formError}</div>}
                    <button type="submit">Create Product</button>
                </form>
            </div>

            {/* Edit Product Form */}
            {editProduct && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Edit Product</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateProduct();
                        }}
                    >
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editProduct.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={editProduct.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Colour:</label>
                            <input
                                type="text"
                                name="colour"
                                value={editProduct.colour}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Code:</label>
                            <input
                                type="text"
                                name="code"
                                value={editProduct.code}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Quantity In Stock:</label>
                            <input
                                type="number"
                                name="quantityInStock"
                                value={editProduct.quantityInStock}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={editProduct.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        {formError && <div style={{ color: 'red' }}>{formError}</div>}
                        <button type="submit">Update Product</button>
                        <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {/* Product List Table */}
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Colour</th>
                    <th>Code</th>
                    <th>Quantity In Stock</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.code}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.colour}</td>
                        <td>{product.code}</td>
                        <td>{product.quantityInStock}</td>
                        <td>{product.price}</td>
                        <td>
                            <button onClick={() => handleEditProduct(product)}>Edit</button>
                            <button
                                onClick={() => deleteProduct(product)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;