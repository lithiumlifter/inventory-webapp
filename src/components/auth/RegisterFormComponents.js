import { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterForm = () => {
  const [namaUser, setNamaUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaUser || !password) {
      setErrorMessage('Nama pengguna dan password diperlukan');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama_user: namaUser, password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/login');
        // alert('Registrasi berhasil! Silakan login.');
      } else {
        setErrorMessage(result.error || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nama_user" className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          id="nama_user"
          placeholder="Masukkan username"
          value={namaUser}
          onChange={(e) => setNamaUser(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <button type="submit" className="btn btn-primary w-100">REGISTER</button>
    </form>
  );
};

export default RegisterForm;
