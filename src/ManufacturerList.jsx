import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManufacturerList = () => {
    // State variables for storing manufacturers, loading state, and error messages
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect to fetch manufacturers when the component is mounted
    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/manufacturers');
                setManufacturers(response.data._embedded.manufacturers);  // Adjust based on your API response structure
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchManufacturers();
    }, []);

    // Show loading message while data is being fetched
    if (loading) return <div>Loading...</div>;

    // Show error message if there is an error
    if (error) return <div>Error: {error}</div>;

    // Render the table with manufacturer data
    return (
        <div>
            <h2>Manufacturer List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Total Orders</th>
                        <th>Order Price</th>
                    </tr>
                </thead>
                <tbody>
                    {manufacturers.map((manufacturer) => (
                        <tr key={manufacturer.id}>
                            <td>{manufacturer.name}</td>
                            <td>{manufacturer.description}</td>
                            <td>{manufacturer.totalOrders}</td>
                            <td>{manufacturer.orderPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManufacturerList;
