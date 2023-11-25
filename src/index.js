const express = require('express')
const app = express()
const PORT = 3000;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Middle que autoriza el carrito
const authorize = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, 'Frase?secreta?');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};


app.use(express.json());
// Usar el middleware de autorización para la ruta /cart
app.use('/api/cart', authorize);

const baseDirectory = path.join(__dirname, 'bd');







////////// ACA COMIENZAN TODOS LOS ENDPOINTS ////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('<h1>Base de datos funcionando</h1>');
});

// Esto agarra los datos de cat.json
app.get('/api/cats/cat', (req, res) => {
    const catJsonPath = path.join(baseDirectory, 'cats', 'cat.json');
    res.sendFile(catJsonPath);
});

// Esto agarra los datos del buy.json
app.get('/api/cart/buy', (req, res) => {
    const buyJsonPath = path.join(baseDirectory, 'cart', 'buy.json');
    res.sendFile(buyJsonPath);
});

// Aca agarramos los cats_products por el id
app.get('/api/cats_products/:catID', (req, res) => {
    const catID = req.params.catID;
    const catProductsJsonPath = path.join(baseDirectory, 'cats_products', `${catID}.json`);
    res.sendFile(catProductsJsonPath);
});
// Aplica lo mismo para products y todos los json divididos en varios archivos
app.get('/api/products/:productID', (req, res) => {
    const productID = req.params.productID;
    const productJsonPath = path.join(baseDirectory, 'products', `${productID}.json`);
    res.sendFile(productJsonPath);
});

//Misma logica para comentarios
app.get('/api/products_comments/:productID', (req, res) => {
    const productID = req.params.productID;
    const productCommentsJsonPath = path.join(baseDirectory, 'products_comments', `${productID}.json`);
    res.sendFile(productCommentsJsonPath);
});

// Devuelve el json de sell
app.get('/api/sell/publish', (req, res) => {
    const publishJsonPath = path.join(baseDirectory, 'sell', 'publish.json');
    res.sendFile(publishJsonPath);
});


// Devuelve el userCart
app.get('/api/user_cart/:userID', (req, res) => {
    const userID = req.params.userID;
    const userCartJsonPath = path.join(baseDirectory, 'user_cart', `${userID}.json`);
    res.sendFile(userCartJsonPath);
});



const users = [
    { id: 1, username: 'facundoDuque@gmail.com', password: '12345facu' },
    { id: 2, username: 'GonzaloMaulella@gmail.co', password: 'gonza12345' }
];

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, 'Frase?secreta?', { expiresIn: '1h' });

    res.json({ token });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});