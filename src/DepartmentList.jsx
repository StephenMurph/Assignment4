import React, { useEffect, useState } from 'react';
import axios from 'axios';


const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateDepartmentVisible, setIsCreateDepartmentVisible] = useState(false);

    const [newDepartment, setNewDepartment] = useState({
        name: '',
        description: '',
        totalSales: 0,
        salesPrice: 0
    });

    const [editDepartment, setEditDepartment] = useState(null); // State to hold the department being edited
    const [formError, setFormError] = useState('');

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departments');
            setDepartments(response.data._embedded.departments); // Adjust based on your API response structure
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial load of departments
    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value
        }));

        // If we're editing a department, update the editDepartment state as well
        if (editDepartment) {
            setEditDepartment((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCreateDepartment = async () => {
        if (!newDepartment.name || !newDepartment.description) {
            setFormError('Name and description are required.');
            return;
        }

        try {
            // Send the POST request to create a new department
            const response = await axios.post('http://localhost:8080/api/departments', newDepartment);

            // Re-fetch the departments to ensure the list is up-to-date
            fetchDepartments();

            // Reset the form fields after the department is created
            setNewDepartment({
                name: '',
                description: '',
                totalSales: 0,
                salesPrice: 0
            });

            // Hide the form after successful creation
            setIsCreateDepartmentVisible(false);

            setFormError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditDepartment = (department) => {
        // Extract the department ID from the `_links.self.href` field
        const id = department._links?.self?.href?.split('/').pop();

        if (!id) {
            console.error('Department ID is missing');
            setFormError('Department ID is missing');
            return;
        }

        // Set the department for editing, including the extracted ID
        setEditDepartment({
            ...department,
            id: id
        });

        console.log('Editing department:', department);
    };

    const handleUpdateDepartment = async () => {
        if (!editDepartment || !editDepartment.id) {
            setFormError('Department ID is missing.');
            return;
        }

        if (!editDepartment.name || !editDepartment.description) {
            setFormError('Name and description are required.');
            return;
        }

        try {
            const putRequestUrl = `http://localhost:8080/api/departments/${editDepartment.id}`;
            await axios.put(putRequestUrl, {
                name: editDepartment.name,
                description: editDepartment.description,
                totalSales: editDepartment.totalSales,
                salesPrice: editDepartment.salesPrice
            });
// Re-fetch the departments to ensure the list is up-to-date
            fetchDepartments();

            // Reset form fields and clear error state after successful update
            setEditDepartment(null);
            setFormError('');
        } catch (err) {
            console.error('Error updating department:', err.response ? err.response.data : err.message);
            setError(err.message);
        }
    };

    const handleDeleteDepartment = async (department) => {
        const id = department._links?.self?.href?.split('/').pop();

        if (!id) {
            console.error('Department ID is missing');
            setFormError('Department ID is missing');
            return;
        }

        try {
            // Send the DELETE request to remove the department
            const deleteRequestUrl = `http://localhost:8080/api/departments/${id}`;

            await axios.delete(deleteRequestUrl);

            // Re-fetch the departments to reflect the deletion
            fetchDepartments();
        } catch (err) {
            console.error('Error deleting department:', err.response ? err.response.data : err.message);
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Department List</h2>

            <button onClick={() => setIsCreateDepartmentVisible(!isCreateDepartmentVisible)}>
                Create Department
            </button>

            {isCreateDepartmentVisible && (
                <div id="create-form" style={{ marginTop: '20px' }}>
                    <h3>Create New Department</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateDepartment();
                        }}
                >
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newDepartment.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={newDepartment.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Total Sales:</label>
                        <input
                            type="number"
                            name="totalSales"
                            value={newDepartment.totalSales}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Sales Price:</label>
                        <input
                            type="number"
                            name="salesPrice"
                            value={newDepartment.salesPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    {formError && <div style={{color: 'red'}}>{formError}</div>}
                    <button type="submit">Create Department</button>
                </form>
            </div>
            )}

            {/* Edit Department Form */}
            {editDepartment && (
                <div style={{marginTop: '20px'}}>
                    <h3>Edit Department</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateDepartment();
                        }}
                    >
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editDepartment.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={editDepartment.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Total Sales:</label>
                            <input
                                type="number"
                                name="totalSales"
                                value={editDepartment.totalSales}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Sales Price:</label>
                            <input
                                type="number"
                                name="salesPrice"
                                value={editDepartment.salesPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        {formError && <div style={{color: 'red'}}>{formError}</div>}
                        <button type="submit">Update Department</button>
                        <button type="button" onClick={() => setEditDepartment(null)}>Cancel</button>
                    </form>
                </div>
            )}

            {/* Department List Table */}
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Total Sales</th>
                    <th>Sales Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {departments.map((department) => (
                    <tr key={department.id}>
                        <td>{department.name}</td>
                        <td>{department.description}</td>
                        <td>{department.totalSales}</td>
                        <td>{department.salesPrice}</td>
                        <td>
                            <button onClick={() => handleEditDepartment(department)}>Edit</button>
                            <button onClick={() => handleDeleteDepartment(department)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentList;