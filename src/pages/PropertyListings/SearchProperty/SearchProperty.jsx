import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchProperty = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const category = searchParams.get('category');
    const type = searchParams.get('type');

    return (
        <div>
            <h1>Search Property</h1>
            <p>Category: {category}</p>
            <p>Type: {type}</p>
        </div>
    );
};

export default SearchProperty;
