import { useEffect } from 'react';
import { useRouter } from 'next/router'; 
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminFooter from '../components/admin/AdminFooter';
import '../styles/ModalComponent.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    
  }, []);

  const isLoginPage = router.pathname === '/';

  return (
    <>
      <Head>
        {/* Link ke file CSS eksternal */}
        <link rel="stylesheet" href="/fonts/line-awesome.svg" />
        <link rel="stylesheet" href="/css/demo.css" />
        <link rel="stylesheet" href="/css/ready.css" />
      </Head>

      {/* Memasukkan jQuery terlebih dahulu */}
      <Script
         src="https://code.jquery.com/jquery-3.6.0.min.js"
         strategy="beforeInteractive"
      ></Script>


      {/* Memasukkan file JS soboadmin setelah jQuery */}
      <Script
        src="/js/ready.js"
        strategy="beforeInteractive" // Pemuatan sebelum interaksi
      ></Script>
      <Script
        src="/js/demo.js"
        strategy="beforeInteractive"
      ></Script>
      {/* <Script src="/js/core/jquery.3.2.1.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/core/popper.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/core/bootstrap.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/chartist/chartist.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/chartist/plugin/chartist-plugin-tooltip.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/bootstrap-notify/bootstrap-notify.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/bootstrap-toggle/bootstrap-toggle.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/jquery-mapael/jquery.mapael.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/jquery-mapael/maps/world_countries.min.js" strategy="beforeInteractive"></Script>
      <Script src="/js/plugin/chart-circle/circles.min.js" strategy="beforeInteractive"></Script> 
      <Script src="/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js" strategy="beforeInteractive"></Script> */}

      {!isLoginPage ? (
        <div className="wrapper">
          <AdminHeader />
          <AdminSidebar />
          <div className="main-panel">
            <Component {...pageProps} />
            <AdminFooter />
          </div>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
