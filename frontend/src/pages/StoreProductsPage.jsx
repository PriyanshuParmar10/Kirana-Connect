import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function StoreProductsPage() {
    const [storeId, setStoreId] = useState(null);
    const [products, setProducts] = useState([]);
    
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemMrp, setNewItemMrp] = useState('');
    const [newItemStock, setNewItemStock] = useState('');
    const [newItemUnit, setNewItemUnit] = useState('piece'); 
    const [newItemCategory, setNewItemCategory] = useState('Groceries');

    useEffect(() => {
        const fetchStoreId = async () => {
            try {
                const res = await api.get('/stores/my-store');
                setStoreId(res.data.store._id);
            } catch (error) {
                console.error("Failed to load store ID", error);
            }
        };
        fetchStoreId();
    }, []);


    const fetchProducts = useCallback(async () => {
        if (!storeId) return; 
        try {
            const res = await api.get(`/products/store/${storeId}`);
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    }, [storeId]);

    useEffect(() => {
        if (storeId) {
            fetchProducts();
        }
    }, [storeId, fetchProducts]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            
            await api.post(`/products/store/${storeId}`, { 
                itemName: newItemName, 
                price: Number(newItemPrice), 
                mrp: Number(newItemMrp),
                stock: Number(newItemStock),
                unit: newItemUnit,
                category: newItemCategory,
                isAvailable: true 
            });
            
            setNewItemName('');
            setNewItemPrice('');
            setNewItemMrp('');
            setNewItemStock('');
            fetchProducts();
        } catch (error) {
            console.error("FULL ERROR:", error.response?.data);
            alert("Backend says: " + (error.response?.data?.message || "Bad Request"));
        }
    };

    const toggleAvailability = async (productId, currentStatus) => {
        try {
            await api.put(`/products/${productId}/toggle`);
            fetchProducts();
        } catch (error) {
            alert("Failed to toggle availability");
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${productId}`);
            fetchProducts();
        } catch (error) {
            alert("Failed to delete product");
        }
    };

    if (!storeId) return <h2 style={{ padding: '20px' }}>Loading Inventory...</h2>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Inventory Manager</h2>
            
            {/* Upgraded Add Product Form */}
            <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', marginBottom: '30px', padding: '15px', border: '1px dashed gray', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" placeholder="Item Name" value={newItemName} onChange={e => setNewItemName(e.target.value)} required style={{ padding: '8px' }}/>
                
                <input type="number" placeholder="Price (₹)" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} required style={{ padding: '8px', width: '100px' }}/>
                
                <input type="number" placeholder="MRP (₹)" value={newItemMrp} onChange={e => setNewItemMrp(e.target.value)} required style={{ padding: '8px', width: '100px' }}/>
                
                <input type="number" placeholder="Stock Qty" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} required style={{ padding: '8px', width: '100px' }}/>
                
                <select value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} style={{ padding: '8px' }}>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="litre">Litre (L)</option>
                    <option value="piece">Piece (pc)</option>
                    <option value="dozen">Dozen</option>
                    <option value="pack">Pack</option>
                </select>

                <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} style={{ padding: '8px' }}>
                    <option value="Groceries">Groceries</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Household">Household</option>
                </select>

                <button type="submit" style={{ backgroundColor: 'black', color: 'white', padding: '8px 15px', cursor: 'pointer', border: 'none' }}>+ Add Product</button>
            </form>

            {/* Product List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {products.length === 0 ? <p>Your inventory is empty. Add a product above!</p> : null}
                {products.map(product => (
                    <div key={product._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{product.itemName}</h4>
                                <small style={{ color: 'gray' }}>{product.category} • {product.unit}</small>
                            </div>
                            <button onClick={() => deleteProduct(product._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>X</button>
                        </div>
                        
                        <div style={{ margin: '10px 0' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '10px' }}>₹{product.price}</span>
                            <span style={{ textDecoration: 'line-through', color: 'gray', fontSize: '14px' }}>₹{product.mrp}</span>
                        </div>
                        
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Stock: <strong>{product.stock}</strong></p>

                        <button 
                            onClick={() => toggleAvailability(product._id, product.isAvailable)}
                            style={{ padding: '8px', backgroundColor: product.isAvailable ? 'green' : 'gray', color: 'white', cursor: 'pointer', border: 'none', borderRadius: '4px', width: '100%' }}
                        >
                            {product.isAvailable ? '🟢 In Stock (Click to hide)' : '🔴 Out of Stock (Click to show)'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}