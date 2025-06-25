import React, { useState } from 'react';
import "./filter_add.css";

const Filter_add = ({ bookItems, selectedStatus, onFilterChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleFilterChange = (status) => {
        onFilterChange(status);
        setIsDropdownOpen(false); // Tutup dropdown klo sdh pilih
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="header-content">
            <div className="title">
                <h1>Daftar Buku 📖</h1>
            </div>

            <div className="filter-container">

                {/* Desktop */}
                <div className="filter-desktop">
                    <div className="filter-books">
                        {bookItems.map((status, index) => (
                            <div
                                key={index}
                                className={`filter ${selectedStatus === status ? 'active' : ''}`}
                                onClick={() => handleFilterChange(status)}
                            >
                                {status}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <div className="filter-mobile">
                    <button onClick={toggleDropdown} className="filter-dropdown-btn">
                        <span className="filter-dropdown-text">{selectedStatus}</span>
                        <span className={`filter-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="filter-dropdown-menu">
                            {bookItems.map((status, index) => (
                                <div
                                    key={index}
                                    className={`filter-dropdown-item ${selectedStatus === status ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(status)}
                                >
                                    {status}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isDropdownOpen && (
                    <div 
                        className="filter-overlay" 
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Filter_add;
