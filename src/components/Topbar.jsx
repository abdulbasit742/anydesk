export default function Topbar({ title, onExport, onConnect }) {
  return (
    <div className="topbar">
      <span className="page-title">{title}</span>
      <div className="topbar-right">
        <button className="btn btn-ghost btn-sm" onClick={onExport}>⬇ Export</button>
        <button className="btn btn-gold btn-sm btn-pulse" onClick={onConnect}>⚡ Connect Account</button>
      </div>
    </div>
  );
}
