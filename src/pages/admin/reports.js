import withAuth from '@/lib/middleware/withAuth';
import React from 'react';

const AdminReports = () => {
  return (
    <div className="content">
      <div className="container-fluid">
        <h4 className="page-title">Reports</h4>
        <div className="row">
          {/* Konten Laporan */}
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminReports);
