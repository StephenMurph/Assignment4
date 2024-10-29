import './App.css'
import { ProfileProvider } from './Profile.jsx';
import ProfileForm from './ProfileForm';
import ProfileDisplay from './ProfileDisplay';

const App = () => {
    return (
        <ProfileProvider>
            <h1>User Profile</h1>
            <div className="form">
                <ProfileForm/>
            </div>
            <div className="card">
                <ProfileDisplay/>
            </div>
        </ProfileProvider>
);
};

export default App;
