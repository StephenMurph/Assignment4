
import { ProfileContext } from './Profile.jsx';
import {useContext} from "react";

const ProfileDisplay = () => {
    const { profile } = useContext(ProfileContext);

    return (
        <div>
            <h2>Profile Information</h2>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio}</p>
        </div>
    );
};

export default ProfileDisplay;