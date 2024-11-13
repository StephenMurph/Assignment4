import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManufacturerList = () => {
    // State variables
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateManufacturerVisible, setIsCreateManufacturerVisible] = useState(false);
    const [newManufacturer, setNewManufacturer] = useState(
        {
        name: '',
        description: '',
        totalOrders: 0,
        orderPrice: 0
    });
    const [editManufacturer, setEditManufacturer] = useState(null);  // Holds the manufacturer being edited
    const [formError, setFormError] = useState('');

    // Function to fetch manufacturers
    const fetchManufacturers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/manufacturers');
            setManufacturers(response.data._embedded.manufacturers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch manufacturers on component mount
    useEffect(() => {
        fetchManufacturers();
    }, []);

    // Handle input changes for both Create and Edit forms
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewManufacturer((prev) => ({
            ...prev,
            [name]: value
        }));

        if (editManufacturer) {
            setEditManufacturer((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Create new manufacturer
    const handleCreateManufacturer = async () => {
        if (!newManufacturer.name || !newManufacturer.description) {
            setFormError('Name and description are required.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/manufacturers', newManufacturer);

            // Re-fetch the manufacturers list
            fetchManufacturers();

            // Reset form fields
            setNewManufacturer({
                name: '',
                description: '',
                totalOrders: 0,
                orderPrice: 0
            });

            setIsCreateManufacturerVisible(false);

            setFormError('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Edit manufacturer
    const handleEditManufacturer = (manufacturer) => {
        const id = manufacturer._links?.self?.href?.split('/').pop();
        if (!id) {
            setFormError('Manufacturer ID is missing.');
            return;
        }

        setEditManufacturer({
            ...manufacturer,
            id: id
        });
    };

    // Update manufacturer
    const handleUpdateManufacturer = async () => {
        if (!editManufacturer || !editManufacturer.id) {
            setFormError('Manufacturer ID is missing.');
            return;
        }

        if (!editManufacturer.name || !editManufacturer.description) {
            setFormError('Name and description are required.');
            return;
        }

        try {
            const putRequestUrl = `http://localhost:8080/api/manufacturers/${editManufacturer.id}`;
            await axios.put(putRequestUrl, {
                name: editManufacturer.name,
                description: editManufacturer.description,
                totalOrders: editManufacturer.totalOrders,
                orderPrice: editManufacturer.orderPrice
            });

            // Re-fetch the manufacturers list
            fetchManufacturers();

            // Reset the form
            setEditManufacturer(null);
            setFormError('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete manufacturer
    const deleteManufacturer = async (manufacturer) => {
        const id = manufacturer._links?.self?.href?.split('/').pop();
        if (!id) {
            setFormError('Manufacturer ID is missing.');
            return;
        }

        try {
            // Send the DELETE request
            await axios.delete(`http://localhost:8080/api/manufacturers/${id}`);

            // Re-fetch the manufacturers list after deletion
            fetchManufacturers();

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
            <h2>Manufacturer List</h2>

            <button onClick={() => setIsCreateManufacturerVisible(!isCreateManufacturerVisible)}>
                Create Manufacturer
            </button>

            {isCreateManufacturerVisible && (
                <div id="create-form" style={{ marginTop: '20px' }}>
                    <h3>Create New Manufacturer</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateManufacturer();
                        }}
                >
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newManufacturer.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={newManufacturer.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Total Orders:</label>
                        <input
                            type="number"
                            name="totalOrders"
                            value={newManufacturer.totalOrders}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Order Price:</label>
                        <input
                            type="number"
                            name="orderPrice"
                            value={newManufacturer.orderPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    {formError && <div style={{color: 'red'}}>{formError}</div>}
                    <button type="submit">Create Manufacturer</button>
                </form>
            </div>
            )}

            {/* Edit Manufacturer Form */}
            {editManufacturer && (
                <div style={{marginTop: '20px'}}>
                    <h3>Edit Manufacturer</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateManufacturer();
                        }}
                    >
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editManufacturer.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={editManufacturer.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Total Orders:</label>
                            <input
                                type="number"
                                name="totalOrders"
                                value={editManufacturer.totalOrders}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Order Price:</label>
                            <input
                                type="number"
                                name="orderPrice"
                                value={editManufacturer.orderPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        {formError && <div style={{color: 'red'}}>{formError}</div>}
                        <button type="submit">Update Manufacturer</button>
                        <button type="button" onClick={() => setEditManufacturer(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {/* Manufacturer List Table */}
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Total Orders</th>
                    <th>Order Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {manufacturers.map((manufacturer) => (
                    <tr key={manufacturer.id}>
                        <td>{manufacturer.name}</td>
                        <td>{manufacturer.description}</td>
                        <td>{manufacturer.totalOrders}</td>
                        <td>{manufacturer.orderPrice}</td>
                        <td>
                            <button onClick={() => handleEditManufacturer(manufacturer)}>Edit</button>
                            <button
                                onClick={() => deleteManufacturer(manufacturer)}
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

export default ManufacturerList;