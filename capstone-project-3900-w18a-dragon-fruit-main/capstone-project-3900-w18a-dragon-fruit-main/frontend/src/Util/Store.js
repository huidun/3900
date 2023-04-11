import React from 'react';

// refer to https://www.robinwieruch.de/local-storage-react
const StoreToken = () => {
    const [token, setToken] = React.useState(
        localStorage.getItem('token') || ''
    );

    React.useEffect(() => {
        localStorage.setItem('token', token);
        console.log(localStorage.getItem('token'));
    }, [token]);

    return [token, setToken];
};

export default StoreToken;