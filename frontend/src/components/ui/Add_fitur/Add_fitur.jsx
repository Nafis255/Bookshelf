import { useState } from 'react';
import './add.css';
import { MdAdd } from "react-icons/md";

const Add_fitur = ({ onAddBook }) => {
    const [popup, setPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverImageFile, setCoverImageFile] = useState(null);

    const togglePopup = () => {
        setPopup(!popup);
        if(popup) {
            setTitle('');
            setAuthor('');
            setCoverImageFile(null);
        }
    }
    const handleFileChange = (e) => setCoverImageFile(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault(); 

        if (!title || !author){
            alert('Judul dan Penulis wajib diisi!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);

        if (coverImageFile){
            formData.append('cover_image', coverImageFile);
        }

        onAddBook(formData);
        togglePopup(); 
    }

    return (
        <div className="popup-container">
            <div className="add-button">
                <div className="add-fitur" onClick={togglePopup}>
                    <MdAdd className="add"/>
                    <p>Tambahkan</p>
                </div>
            </div>

            {popup && (
                <div className="popup">
                    <div className="form-container">
                        <form onSubmit={handleSubmit} className='form-popup'>  
                            <div className="title-form">Tambahkan</div>

                            <div className="input-form">
                                <input 
                                    type="file" 
                                    placeholder="Cover Buku"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="input-form">
                                <input 
                                    type="text" 
                                    placeholder="Judul buku" 
                                    required value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="input-form">
                                <input 
                                    type="text" 
                                    placeholder="Penulis" 
                                    required value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </div>
                            

                            <div className="button-action">
                                <div className="button-form">
                                    <button type="button" className="cancel-form" onClick={togglePopup}>
                                        Batal
                                    </button>
                                    <button type="submit" className="submit-form">
                                        Tambah
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Add_fitur;