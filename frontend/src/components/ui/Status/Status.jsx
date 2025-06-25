import React from 'react';
import './status.css';

const Status = ({status}) => {
    const statusStyle = {
        Belum: {backgroundColor: "rgb(108, 8, 8)"},
        Proses: {backgroundColor: "rgb(107, 104, 5)"},
        Selesai: {backgroundColor: "rgb(11, 82, 2)"}
    }

    return (
        <p className="status-text" style={statusStyle[status]}>{status}</p>
    )
}

export default Status;