import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({ name: '', email: '' });

    const saveProfile = (newProfile) => {
        setProfile(newProfile);
    };

    return (
        <ProfileContext.Provider value={{ profile, saveProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};