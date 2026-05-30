import './PageLoader.css';

export default function PageLoader({ state }) {
  if (state === 'idle') return null;

  return (
    <div className={`page-loader-overlay pl-${state}`} aria-hidden={state === 'idle'}>
      <div className="pl-content">
        
        {/* Widescreen brand text */}
        <div className="pl-logo-wrap">
          <h2 className="font-serif pl-logo-text">МАНЖО ГРИЛЬ</h2>
          <span className="pl-logo-sub">RESTAURANT</span>
        </div>

        {/* Minimal thin progress line */}
        <div className="pl-progress-container">
          <div className="pl-progress-bar" />
        </div>

      </div>
    </div>
  );
}

