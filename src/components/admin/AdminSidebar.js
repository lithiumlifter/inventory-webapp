import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminSidebar = () => {
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path ? 'active' : '';
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Sidebar Menu */}
        <div className="collapse navbar-collapse" id="adminSidebarMenu">
          <div className="sidebar">
            <div className="scrollbar-inner sidebar-wrapper">
              <div className="user">
                <div className="photo">
                  <img src="/img/profile.jpg" alt="User Profile" />
                </div>
                <div className="info">
                  <Link href="#userMenu" className="d-block" data-bs-toggle="collapse" aria-expanded="false" aria-controls="userMenu" style={{ textDecoration: 'none' }}>
                    <span>
                      Hizrian
                      <span className="user-level">Administrator</span>
                    </span>
                  </Link>
                </div>
              </div>
              <ul className="nav">
                <li className={`nav-item ${isActive('/admin/dashboard')}`}>
                  <Link href="/admin/dashboard" className="nav-link">
                    <i className="la la-dashboard" />
                    <p>Dashboard</p>
                  </Link>
                </li>
                <li className={`nav-item ${isActive('/admin/products')}`}>
                  <Link href="/admin/products" className="nav-link">
                    <i className="la la-table" />
                    <p>Produk</p>
                  </Link>
                </li>
                <li className={`nav-item ${isActive('/admin/categories')}`}>
                  <Link href="/admin/categories" className="nav-link">
                    <i className="la la-keyboard-o" />
                    <p>Kategori</p>
                  </Link>
                </li>
                <li className={`nav-item ${isActive('/admin/reports')}`}>
                  <Link href="/admin/reports" className="nav-link">
                    <i className="la la-th" />
                    <p>Report</p>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link href="notifications.html" className="nav-link">
                    <i className="la la-bell" />
                    <p>Notifications</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="typography.html" className="nav-link">
                    <i className="la la-font" />
                    <p>Typography</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="icons.html" className="nav-link">
                    <i className="la la-fonticons" />
                    <p>Icons</p>
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;
