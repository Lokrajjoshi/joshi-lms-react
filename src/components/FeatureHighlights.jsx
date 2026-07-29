import Icon from "./Icon";

const features = [
  {
    icon: "compass",
    title: "A clear path forward",
    text: "Focused lessons organized to take you from fundamentals to confident application.",
  },
  {
    icon: "code",
    title: "Learn by building",
    text: "Practical examples make every concept easier to understand, remember, and use.",
  },
  {
    icon: "shield",
    title: "Support when needed",
    text: "Get course guidance and a helpful response whenever you need more direction.",
  },
];

function FeatureHighlights() {
  return (
    <section className="features-section" aria-label="Why learn with Joshi LMS">
      <div className="container features-grid">
        {features.map((feature, index) => (
          <article className="feature-item" key={feature.title}>
            <span className={`feature-icon feature-icon-${index + 1}`}>
              <Icon name={feature.icon} size={23} />
            </span>
            <div>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeatureHighlights;
