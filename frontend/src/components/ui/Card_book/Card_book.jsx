import './card.css';
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

const Card_book = ({ item, onDelete, onStatusChange, onEdit }) => {

    const handleStatusSelect = (e, bookId) => {
        const newStatus = e.target.value;
        onStatusChange(bookId, newStatus);
    };

    return (
        <div className="card-wraper">
            {item.map((val) => (
                <div key={val.id} className='card-container'>
                    <div className="card-content">
                        <img 
                            src={val.cover_image || 'https://raw.githubusercontent.com/putrifajarr/cover-book/main/no-cover.png'} 
                            alt={val.title} 
                            className="cover-book" 
                        />

                        <div className="modify-container">
                            <div className="status">
                                <select 
                                    className="status-select-card" 
                                    value={val.status} 
                                    onChange={(e) => handleStatusSelect(e, val.id)}
                                >
                                    <option value="Belum">Belum</option>
                                    <option value="Proses">Proses</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>

                            <div className="edit-delete">
                                <MdDeleteOutline 
                                    className="icon" 
                                    onClick={() => onDelete(val.id)}
                                />
                                <MdOutlineEdit 
                                    className="icon"
                                    onClick={() => onEdit(val)} 
                                />
                            </div>
                        </div>

                        <div className="name-book">
                            <div className="judul">{val.title}</div>
                            <div className="author">{val.author}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card_book;