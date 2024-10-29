
import { ProfileContext } from './Profile.jsx';
import {useContext, useState} from "react";

const ProfileForm = () => {
    const { saveProfile } = useContext(ProfileContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        saveProfile({ name, email, bio });
        setName('');
        setEmail('');
        setBio('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)} // Update bio state
                required
            />
            <button type="submit">Save Profile</button>
        </form>
    );
};

export default ProfileForm;