export default function LoadingCard({ text = 'Se încarcă...' }) {
  return (
    <div className="card loading-card">
      <div className="loading-spinner" />
      <p>{text}</p>
    </div>
  );
}