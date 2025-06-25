import { useState, useEffect } from 'react';
import './Edit_book.css';

const Edit_book = ({ book, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [newCoverFile, setNewCoverFile] = useState(null);

    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setAuthor(book.author);
        }
    }, [book]);

    const handleFileChange = (e) => {
        setNewCoverFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);

        if (newCoverFile) {
            formData.append('cover_image', newCoverFile);
        }
        
        onSave(formData);
    };

    if (!book) return null;

    return (
        <div className="popup">
            <div className="form-container">
                <form onSubmit={handleSubmit} className='form-popup'>
                    <div className="title-form">Edit Buku</div>

                    <div className="input-form">
                        <label>Judul Buku</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-form">
                        <label>Penulis</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-form">
                        <label>Ganti Cover (Opsional)</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                        />
                    </div>

                    <div className="button-action">
                        <div className="button-form">
                            <button type="button" className="cancel-form" onClick={onClose}>
                                Batal
                            </button>
                            <button type="submit" className="submit-form">
                                Simpan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Edit_book;