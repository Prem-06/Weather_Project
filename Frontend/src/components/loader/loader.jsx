import React from 'react';
import './loader.css'
function Loader({ type, bgColor, color, size }) {
    const loaderStyle = {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%', 
        height: '100%',
        backgroundColor: bgColor,
    };

    const spinnerStyle = {
        width: 40 + 'px',
        height: 40 + 'px',
        border: '4px solid ' + color,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        borderTop: '4px solid transparent',
        animation: 'spin 1s linear infinite',
    };

    return (
        <div style={loaderStyle}>
            <div style={spinnerStyle}></div>
        </div>
    );
}

export default Loader;
