import "./Loader.css";

function Loader({ show }) {
  if (!show) return null;
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-spinner" />
    </div>
  );
}

export default Loader;
