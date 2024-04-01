import express from 'express';
import ProductManager from './productManager.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const manager = new ProductManager('./productos.json');

app.get('/api/products', async (req, res) => {
    try {
        const products = await manager.leerArchivo();
        res.send({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

app.get('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productFound = await manager.getProductById(parseInt(pid));
        res.send({ status: 'success', payload: productFound });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message });
    }
});

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});