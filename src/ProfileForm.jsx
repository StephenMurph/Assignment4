// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useProfile } from './Profile.jsx';

const ProfileForm = () => {
    const { profile, updateProfile } = useProfile();
    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData); // Update profile context with form data
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />
            </label>
            <label>
                Age:
                <input
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    placeholder="Enter your age"
                />
            </label>
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default ProfileForm;