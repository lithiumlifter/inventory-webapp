const ImageComponent = () => {
    return (
      <div className="col-md-6 d-none d-md-block">
        <img
          src="/img/login_img.jpg"
          alt="Login Banner"
          className="img-fluid rounded"
          style={{ height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  };
  
  export default ImageComponent;
  