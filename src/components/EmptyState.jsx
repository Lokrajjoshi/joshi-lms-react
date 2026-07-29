import Icon from "./Icon";

function EmptyState({ icon, title, text, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <span><Icon name={icon} size={28} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && (
        <button className="button button-dark" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
