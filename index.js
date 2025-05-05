const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
// 1. Jurusan Routes
app.get('/jurusan', async (req, res) => {
  try {
    const jurusan = await prisma.jurusan.findMany({
      include: { prodi: true }
    });
    res.json(jurusan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/jurusan', async (req, res) => {
  try {
    const { nama_jurusan, ketua_jurusan } = req.body;
    const jurusan = await prisma.jurusan.create({
      data: { nama_jurusan, ketua_jurusan }
    });
    res.status(201).json(jurusan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Prodi Routes
app.get('/prodi', async (req, res) => {
  try {
    const prodi = await prisma.prodi.findMany({
      include: { jurusan: true }
    });
    res.json(prodi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/prodi', async (req, res) => {
  try {
    const { nama_prodi, ketua_prodi, jurusanId } = req.body;
    const prodi = await prisma.prodi.create({
      data: { nama_prodi, ketua_prodi, jurusanId }
    });
    res.status(201).json(prodi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. User Routes
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        jurusan: true,
        prodi: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { kode, nama, no_telp, jurusanId, prodiId } = req.body;
    
    // Check if user with this kode already exists
    const existingUser = await prisma.user.findUnique({
      where: { kode: kode }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User dengan kode ini sudah ada',
        message: 'Gunakan kode yang berbeda atau update user yang sudah ada'
      });
    }
    
    const user = await prisma.user.create({
      data: { kode, nama, no_telp, jurusanId, prodiId }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        jurusan: true,
        prodi: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const { kode, nama, no_telp, jurusanId, prodiId } = req.body;
    
    // If kode is being changed, check if the new kode is already in use
    if (kode) {
      const existingUser = await prisma.user.findUnique({
        where: { kode: kode }
      });
      
      if (existingUser && existingUser.id !== parseInt(req.params.id)) {
        return res.status(400).json({ 
          error: 'Kode ini sudah digunakan oleh user lain',
          message: 'Gunakan kode yang berbeda'
        });
      }
    }
    
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { kode, nama, no_telp, jurusanId, prodiId }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Check if the user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User tidak ditemukan',
        message: 'User dengan ID ini tidak ada di database'
      });
    }
    
    // If user exists, proceed with deletion
    await prisma.user.delete({
      where: { id: userId }
    });
    
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});