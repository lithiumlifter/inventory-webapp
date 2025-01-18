const LoginForm = () => {
  return (
    <form>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="rizkycavendio@example.com"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          required
        />
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe" className="ms-2">Remember me</label>
        </div>
        <a href="#" className="text-decoration-none">Forgot password?</a>
      </div>
      <button type="submit" className="btn btn-primary w-100">LOGIN</button>
    </form>
  );
};

export default LoginForm;
