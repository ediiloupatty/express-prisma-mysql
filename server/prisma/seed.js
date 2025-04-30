const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Insert Jurusan
  const jurusan1 = await prisma.jurusan.create({
    data: {
      nama_jurusan: 'Teknologi Informasi',
      ketua_jurusan: 'Dr. Budi Santoso'
    }
  });

  const jurusan2 = await prisma.jurusan.create({
    data: {
      nama_jurusan: 'Teknik Sipil',
      ketua_jurusan: 'Ir. Susi Wulandari'
    }
  });

  // Insert Prodi
  const prodi1 = await prisma.prodi.create({
    data: {
      nama_prodi: 'Informatika',
      ketua_prodi: 'Agus Setiawan',
      jurusan: { connect: { id: jurusan1.id } }
    }
  });

  const prodi2 = await prisma.prodi.create({
    data: {
      nama_prodi: 'Sistem Informasi',
      ketua_prodi: 'Nur Aini',
      jurusan: { connect: { id: jurusan1.id } }
    }
  });

  // Insert Users
  await prisma.user.createMany({
    data: [
      {
        kode: 'U001',
        nama: 'Alice',
        no_telp: '08123456789',
        jurusanId: jurusan1.id,
        prodiId: prodi1.id
      },
      {
        kode: 'U002',
        nama: 'Bob',
        no_telp: '08129876543',
        jurusanId: jurusan1.id,
        prodiId: prodi2.id
      },
      {
        kode: 'U003',
        nama: 'Charlie',
        no_telp: '08991234567',
        jurusanId: jurusan2.id,
        prodiId: null // misalnya belum punya prodi
      }
    ]
  });
}

main()
  .then(() => {
    console.log('✅ Dummy data berhasil ditambahkan!');
  })
  .catch((e) => {
    console.error('❌ Error seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });