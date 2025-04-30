// Konfigurasi API
const API_URL = 'http://localhost:5000';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Load data saat halaman dimuat
    loadUsers();
    loadJurusan();
    loadProdi();

    // Event Listeners untuk form tambah data
    document.getElementById('addUserForm').addEventListener('submit', addUser);
    document.getElementById('addJurusanForm').addEventListener('submit', addJurusan);
    document.getElementById('addProdiForm').addEventListener('submit', addProdi);
    document.getElementById('editUserForm').addEventListener('submit', updateUser);

    // Tambahkan event listener untuk perubahan jurusan pada form user
    document.getElementById('jurusanId').addEventListener('change', function() {
        loadProdiByJurusan(this.value, 'prodiId');
    });

    // Tambahkan event listener untuk perubahan jurusan pada form edit user
    document.getElementById('editJurusanId').addEventListener('change', function() {
        loadProdiByJurusan(this.value, 'editProdiId');
    });

    // Tambahkan event listener untuk tab
    const tabEls = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabEls.forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target').replace('#', '');
            if (targetId === 'users') loadUsers();
            if (targetId === 'jurusan') loadJurusan();
            if (targetId === 'prodi') loadProdi();
        });
    });
});

// ===== USER FUNCTIONS =====
// Load Users Data
async function loadUsers() {
    const userTableBody = document.getElementById('userTableBody');
    const userLoader = document.getElementById('userLoader');
    
    userLoader.style.display = 'block';
    userTableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.kode}</td>
                <td>${user.nama}</td>
                <td>${user.no_telp || '-'}</td>
                <td>${user.jurusan ? user.jurusan.nama_jurusan : '-'}</td>
                <td>${user.prodi ? user.prodi.nama_prodi : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-action" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Gagal memuat data users');
    } finally {
        userLoader.style.display = 'none';
    }
}

// Add User
async function addUser(event) {
    event.preventDefault();
    
    const userData = {
        kode: document.getElementById('kode').value,
        nama: document.getElementById('nama').value,
        no_telp: document.getElementById('no_telp').value,
        jurusanId: parseInt(document.getElementById('jurusanId').value),
        prodiId: document.getElementById('prodiId').value ? parseInt(document.getElementById('prodiId').value) : null
    };
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal menambahkan user');
        }
        
        // Reset form dan tutup modal
        document.getElementById('addUserForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        
        // Muat ulang data
        loadUsers();
        
        alert('User berhasil ditambahkan');
    } catch (error) {
        console.error('Error adding user:', error);
        alert(error.message);
    }
}

// Edit User - Mengambil data user untuk diedit
async function editUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        const user = await response.json();
        
        // Isi form dengan data user
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editKode').value = user.kode;
        document.getElementById('editNama').value = user.nama;
        document.getElementById('editNoTelp').value = user.no_telp || '';
        
        // Load jurusan untuk edit form
        await loadAllJurusan('editJurusanId');
        document.getElementById('editJurusanId').value = user.jurusanId;
        
        // Load prodi berdasarkan jurusan yang dipilih
        await loadProdiByJurusan(user.jurusanId, 'editProdiId');
        if (user.prodiId) {
            document.getElementById('editProdiId').value = user.prodiId;
        }
        
        // Tampilkan modal
        const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editUserModal.show();
    } catch (error) {
        console.error('Error fetching user:', error);
        alert('Gagal memuat data user untuk diedit');
    }
}

// Update User
async function updateUser(event) {
    event.preventDefault();
    
    const userId = document.getElementById('editUserId').value;
    const userData = {
        kode: document.getElementById('editKode').value,
        nama: document.getElementById('editNama').value,
        no_telp: document.getElementById('editNoTelp').value,
        jurusanId: parseInt(document.getElementById('editJurusanId').value),
        prodiId: document.getElementById('editProdiId').value ? parseInt(document.getElementById('editProdiId').value) : null
    };
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal mengupdate user');
        }
        
        // Tutup modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
        
        // Muat ulang data
        loadUsers();
        
        alert('User berhasil diupdate');
    } catch (error) {
        console.error('Error updating user:', error);
        alert(error.message);
    }
}

// Delete User
async function deleteUser(userId) {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal menghapus user');
        }
        
        // Muat ulang data
        loadUsers();
        
        alert('User berhasil dihapus');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message);
    }
}

// ===== JURUSAN FUNCTIONS =====
// Load Jurusan Data
async function loadJurusan() {
    const jurusanTableBody = document.getElementById('jurusanTableBody');
    const jurusanLoader = document.getElementById('jurusanLoader');
    
    jurusanLoader.style.display = 'block';
    jurusanTableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/jurusan`);
        const jurusanList = await response.json();
        
        jurusanList.forEach(jurusan => {
            const row = document.createElement('tr');
            const formattedDate = new Date(jurusan.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            
            row.innerHTML = `
                <td>${jurusan.id}</td>
                <td>${jurusan.nama_jurusan}</td>
                <td>${jurusan.ketua_jurusan}</td>
                <td>${jurusan.prodi ? jurusan.prodi.length : 0}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteJurusan(${jurusan.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            jurusanTableBody.appendChild(row);
        });
        
        // Juga update dropdown jurusan di form tambah user
        await loadAllJurusan('jurusanId');
        await loadAllJurusan('jurusanIdProdi');
    } catch (error) {
        console.error('Error loading jurusan:', error);
        alert('Gagal memuat data jurusan');
    } finally {
        jurusanLoader.style.display = 'none';
    }
}

// Add Jurusan
async function addJurusan(event) {
    event.preventDefault();
    
    const jurusanData = {
        nama_jurusan: document.getElementById('nama_jurusan').value,
        ketua_jurusan: document.getElementById('ketua_jurusan').value
    };
    
    try {
        const response = await fetch(`${API_URL}/jurusan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jurusanData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal menambahkan jurusan');
        }
        
        // Reset form dan tutup modal
        document.getElementById('addJurusanForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addJurusanModal'));
        modal.hide();
        
        // Muat ulang data
        loadJurusan();
        
        alert('Jurusan berhasil ditambahkan');
    } catch (error) {
        console.error('Error adding jurusan:', error);
        alert(error.message);
    }
}

// Delete Jurusan
async function deleteJurusan(jurusanId) {
    if (!confirm('Apakah Anda yakin ingin menghapus jurusan ini? Semua prodi yang terkait juga akan dihapus.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/jurusan/${jurusanId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal menghapus jurusan');
        }
        
        // Muat ulang data
        loadJurusan();
        loadProdi();
        loadUsers();
        
        alert('Jurusan berhasil dihapus');
    } catch (error) {
        console.error('Error deleting jurusan:', error);
        alert('Gagal menghapus jurusan. Pastikan tidak ada user atau prodi yang terkait.');
    }
}

// Load all jurusan untuk dropdown
async function loadAllJurusan(selectId) {
    const selectElement = document.getElementById(selectId);
    
    try {
        const response = await fetch(`${API_URL}/jurusan`);
        const jurusanList = await response.json();
        
        // Simpan opsi pertama
        const firstOption = selectElement.querySelector('option:first-child');
        selectElement.innerHTML = '';
        selectElement.appendChild(firstOption);
        
        jurusanList.forEach(jurusan => {
            const option = document.createElement('option');
            option.value = jurusan.id;
            option.textContent = jurusan.nama_jurusan;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading jurusan for dropdown:', error);
    }
}

// ===== PRODI FUNCTIONS =====
// Load Prodi Data
async function loadProdi() {
    const prodiTableBody = document.getElementById('prodiTableBody');
    const prodiLoader = document.getElementById('prodiLoader');
    
    prodiLoader.style.display = 'block';
    prodiTableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/prodi`);
        const prodiList = await response.json();
        
        prodiList.forEach(prodi => {
            const row = document.createElement('tr');
            const formattedDate = new Date(prodi.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            
            row.innerHTML = `
                <td>${prodi.id}</td>
                <td>${prodi.nama_prodi}</td>
                <td>${prodi.ketua_prodi}</td>
                <td>${prodi.jurusan ? prodi.jurusan.nama_jurusan : '-'}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteProdi(${prodi.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            prodiTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading prodi:', error);
        alert('Gagal memuat data prodi');
    } finally {
        prodiLoader.style.display = 'none';
    }
}

// Add Prodi
async function addProdi(event) {
    event.preventDefault();
}