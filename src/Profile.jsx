// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext } from 'react';

// Create a context for the profile
const ProfileContext = createContext();

// ProfileProvider component to manage the profile state
// eslint-disable-next-line react/prop-types
export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        age: null,
    });

    const updateProfile = (newProfile) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            ...newProfile,
        }));
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

// Custom hook to use the profile context
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};