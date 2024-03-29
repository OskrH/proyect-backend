const fs = require("fs");
const path = './file/productos.json';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async leerArchivo() {
        try {
            const productJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(productJson);
        } catch (error) {
            return [];
        }
    }

    async addProduct(productos) {
        try {
            const products = await this.leerArchivo();
            if (products.length === 0) {
                productos.id = 1;
            } else {
                productos.id = products.length + 1;
            }
            products.push(productos);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'), 'utf-8');
            return products;
        } catch (error) {
            console.log(error);
        }

        if (!productos.titulo || !productos.description || !productos.precio || !productos.thumbnail || !productos.code || !productos.stock) {
            throw new Error('Todos los campos son obligatorios.');
        }

        const existeProducto = this.products.some(p => p.code === productos.code);
        if (existeProducto) {
            throw new Error('Ya existe un producto con ese código.');
        }

        this.products.push(productos);
    }

    getProductById(id) {
        const producto = this.products.find(producto => producto.id === id);
        if (!producto) {
            throw new Error(`El producto con Id: ${id} no se encontró.`);
        }
        return producto;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(
                'No se puede actualizar un producto con un id que no existe'
            );
        }
        this.products[index] = { ...this.products[index], ...updatedProduct };
        fs.writeFileSync(this.path, JSON.stringify(this.products));
        return this.products[index];
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(
                'No se puede eliminar un producto con un id que no existe'
            );
        }
        const deletedProduct = this.products.splice(index, 1);
        fs.writeFileSync(this.path, JSON.stringify(this.products));
        return deletedProduct;
    }

}



// Ejemplo de uso de la clase ProductManager
const manager = new ProductManager('./file/productos.json');

// Agregar algunos productos
manager.addProduct({ titulo: 'Teclado', description: 'Teclado mecánico retroiluminado', precio: 29.99, thumbnail: 'teclado.jpg', code: 'KB123', stock: 50 });
manager.addProduct({ titulo: 'Mouse', description: 'Mouse inalámbrico ergonómico', precio: 19.99, thumbnail: 'mouse.jpg', code: 'MS456', stock: 30 });
