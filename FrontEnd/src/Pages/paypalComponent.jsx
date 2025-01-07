import React from 'react';

const PayPalComponent = () => {
    return (
        <div>
            <h1>Node.js Complete Course</h1>
            <h2>Price: $100.00</h2>
            <form action="http://localhost:3005/sam/pay" method="post">
                <input type="submit" value="Buy" />
            </form>
        </div>
    );
};

export default PayPalComponent;
