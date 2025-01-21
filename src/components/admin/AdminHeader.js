import React from 'react';
import Link from 'next/link';

const AdminHeader = () => {
  return (
    <div className="main-header">
      <div className="logo-header">
        <Link href="#" className="logo" style={{ textDecoration: 'none' }}>Test Eureka</Link>
        <button 
          className="navbar-toggler sidenav-toggler ml-auto" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#adminSidebarMenu" 
          aria-controls="adminSidebarMenu" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <button className="topbar-toggler more"><i className="la la-ellipsis-v" /></button>
      </div>
      <nav className="navbar navbar-header navbar-expand-lg">
        <div className="container-fluid">
          <form className="navbar-left navbar-form nav-search mr-md-3" action>
            <div className="input-group">
              <input type="text" placeholder="Search ..." className="form-control" />
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="la la-search search-icon" />
                </span>
              </div>
            </div>
          </form>
          <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
            <li className="nav-item dropdown hidden-caret">
              <Link href="#" className="nav-link dropdown-toggle">
                <i className="la la-envelope" />
              </Link>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <div className="dropdown-item">Action</div>
                <div className="dropdown-item">Another action</div>
                <div className="dropdown-divider" />
                <div className="dropdown-item">Something else here</div>
              </div>
            </li>
            <li className="nav-item dropdown hidden-caret">
              <Link href="#" className="nav-link dropdown-toggle">
                <i className="la la-bell" />
                <span className="notification">3</span>
              </Link>
              <ul className="dropdown-menu notif-box" aria-labelledby="navbarDropdown">
                <li>
                  <div className="dropdown-title">You have 4 new notification</div>
                </li>
                <li>
                  <div className="notif-center">
                    <Link href="#">
                      <div className="notif-icon notif-primary">
                        <i className="la la-user-plus" />
                      </div>
                      <div className="notif-content">
                        <span className="block">New user registered</span>
                        <span className="time">5 minutes ago</span>
                      </div>
                    </Link>
                    {/* More notifications here */}
                  </div>
                </li>
                <li>
                  <Link href="javascript:void(0);" className="see-all">
                    <strong>See all notifications</strong>
                    <i className="la la-angle-right" />
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link href="#" className="dropdown-toggle profile-pic" style={{ textDecoration: 'none' }} data-bs-toggle="dropdown" aria-expanded="false">
                <img src="/img/profile.jpg" alt="user-img" width={36} className="img-circle" />
                <span>Hizrian</span>
              </Link>
              {/* Dropdown menu */}
              <ul className="dropdown-menu dropdown-user">
                <Link href="#" className="dropdown-item"><i className="fa fa-power-off" /> Logout</Link>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default AdminHeader;
