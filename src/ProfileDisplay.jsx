import React from 'react';
import { useProfile } from './Profile.jsx';

const ProfileDisplay = () => {
    const { profile } = useProfile();

    return (
        <div className="profile-display">
            <h3>Profile Information</h3>
            <p><strong>Name:</strong> {profile.name || 'Not provided'}</p>
            <p><strong>Email:</strong> {profile.email || 'Not provided'}</p>
            <p><strong>Age:</strong> {profile.age || 'Not provided'}</p>
        </div>
    );
};

export default ProfileDisplay;