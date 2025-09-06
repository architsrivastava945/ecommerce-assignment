import react, { useEffect, useState } from 'react';
import{ Row, Col } from 'react-bootstrap';
import Product from '../components/Product.jsx';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const { keywords } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get(`/api/products?keywords=${keywords || ''}`);
            setProducts(data);
        };
        fetchProducts();
    }, [keywords]);

    return (
        <>
            <h1>Latest Products</h1>
            <Row>
                {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default HomePage;
