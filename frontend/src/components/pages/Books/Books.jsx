import { useState, useEffect } from 'react';
import axios from 'axios'; 
import Header from '../../ui/Header/Header';
import Filter_add from '../../ui/Filter_add/Filter_add';
import Add_fitur from '../../ui/Add_fitur/Add_fitur';
import Card_book from '../../ui/Card_book/Card_book';
import Edit_book from '../../ui/Edit_book/Edit_book';

// Ganti dengan URL backend Anda. Pastikan backend sudah berjalan.
const API_URL = 'http://localhost:3001/api'; 

const Books = () => {
    const [allItems, setAllItems] = useState([]); 
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedStatus, setStatus] = useState('Semua');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${API_URL}/progress/books-with-progress`);
            if (response.data.success) {
                const books = response.data.data.map(book => ({
                    ...book,
                    status: book.status === 'not_started' ? 'Belum' :
                            book.status === 'reading' ? 'Proses' : 'Selesai'
                }));
                setAllItems(books);
                setFilteredItems(books); 
            }
        } catch (error) {
            console.error("Gagal mengambil data buku:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filterBooks = (status) => {
        setStatus(status);
        if (status === 'Semua') {
            setFilteredItems(allItems);
        } else {
            const filtered = allItems.filter((book) => book.status === status);
            setFilteredItems(filtered);
        }
    };

    const handleAddBook = async (formData) => {
        try {
            await axios.post(`${API_URL}/books`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Buku berhasil ditambahkan!');
            fetchBooks();
        } catch (error) {
            console.error("Gagal menambah buku:", error);
            alert(error.response?.data?.message || 'Gagal menambah buku.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            try {
                await axios.delete(`${API_URL}/books/${id}`);
                alert('Buku berhasil dihapus.');
                fetchBooks(); 
            } catch (error) {
                console.error("Gagal menghapus buku:", error);
                alert('Gagal menghapus buku.');
            }
        }
    };

    const handleStatusChange = async (bookId, newStatus) => {
        const statusMap = {
            'Belum': 'not_started',
            'Proses': 'reading',
            'Selesai': 'completed'
        };
        const backendStatus = statusMap[newStatus];

        try {
            await axios.put(`${API_URL}/progress/book/${bookId}`, { status: backendStatus });

            const updatedItems = allItems.map(item => 
                item.id === bookId ? { ...item, status: newStatus } : item
            );
            setAllItems(updatedItems);

            if (selectedStatus === 'Semua') {
                setFilteredItems(updatedItems);
            } else {
                const filtered = updatedItems.filter(book => book.status === selectedStatus);
                setFilteredItems(filtered);
            }

        } catch (error) {
            console.error("Gagal mengubah status:", error);
            alert('Gagal mengubah status buku.');
        }
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
        setIsEditModalOpen(true);
    };
    
    const handleUpdateBook = async (formData) => {
        if (!editingBook) return;
        try {
            await axios.put(`${API_URL}/books/${editingBook.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Buku berhasil diperbarui!');
            setIsEditModalOpen(false);
            setEditingBook(null);
            fetchBooks();
        } catch (error) {
            console.error("Gagal memperbarui buku:", error);
            alert(error.response?.data?.message || 'Gagal memperbarui buku.');
        }
    };

    const bookStatusOptions = ['Semua', 'Belum', 'Proses', 'Selesai'];

    return (
        <div>
            <Header />
            <Filter_add 
                bookItems={bookStatusOptions}
                onFilterChange={filterBooks}
                selectedStatus={selectedStatus}
            />
            <Add_fitur onAddBook={handleAddBook} />
            <Card_book 
                item={filteredItems} 
                onDelete={handleDelete} 
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
            />
            {isEditModalOpen && (
                <Edit_book
                    book={editingBook}
                    onSave={handleUpdateBook}
                    onClose={() => setIsEditModalOpen(false)}
                /> 
            )}            
        </div>
    );
};

export default Books;
