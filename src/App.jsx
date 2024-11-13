import './App.css';
import DepartmentList from './DepartmentList';
import ProductList from './ProductList';
import ManufacturerList from './ManufacturerList';

const App = () => {
    return (
        <div>
            <h2>Inventory Management</h2>
            <div className="data-tables">
                <div className="table-container">
                    <h3></h3>
                    <ProductList />
                </div>
                <div className="table-container">
                    <h3></h3>
                    <ManufacturerList />
                </div>
                <div className="table-container">
                    <h3></h3>
                    <DepartmentList />
                </div>
            </div>
        </div>
    );
};

export default App;