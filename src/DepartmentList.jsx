import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepartmentList = () => {
    // State variables for storing departments, loading state, and error messages
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect to fetch departments when the component is mounted
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/departments');
                setDepartments(response.data._embedded.departments);  // Adjust based on your API response structure
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    // Show loading message while data is being fetched
    if (loading) return <div>Loading...</div>;

    // Show error message if there is an error
    if (error) return <div>Error: {error}</div>;

    // Render the table with department data
    return (
        <div>
            <h2>Department List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Total Sales</th>
                        <th>Sales Price</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department) => (
                        <tr key={department.id}>
                            <td>{department.name}</td>
                            <td>{department.description}</td>
                            <td>{department.totalSales}</td>
                            <td>{department.salesPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentList;
