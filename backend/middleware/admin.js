// middleware/admin.js
const isAdmin = (req, res, next) => {
    // Verificamos si hay un usuario y si es admin
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Acceso denegado - Se requieren privilegios de administrador'
        });
    }
};

module.exports = isAdmin;