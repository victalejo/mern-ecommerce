import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRoutes from './routes.jsx';
import {CartProvider} from "./context/CartContext.jsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <AppRoutes />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;