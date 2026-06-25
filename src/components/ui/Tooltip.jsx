

const tooltipCss = `
  .bsp-tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .bsp-tooltip-content {
    position: absolute;
    z-index: 9999;
    background: rgba(20,20,36,0.98);
    color: #e8e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.5;
    padding: 6px 10px;
    border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  .bsp-tooltip-content::before {
    content: '';
    position: absolute;
    border: 5px solid transparent;
  }
  /* Positions */
  .bsp-tooltip-content.top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
  }
  .bsp-tooltip-content.top::before {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: rgba(255,255,255,0.1);
  }
  .bsp-tooltip-content.bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
  }
  .bsp-tooltip-content.bottom::before {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: rgba(255,255,255,0.1);
  }
  .bsp-tooltip-content.left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) translateX(4px);
  }
  .bsp-tooltip-content.left::before {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: rgba(255,255,255,0.1);
  }
  .bsp-tooltip-content.right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) translateX(-4px);
  }
  .bsp-tooltip-content.right::before {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: rgba(255,255,255,0.1);
  }
  /* Show state via parent hover with CSS */
  .bsp-tooltip-wrapper:hover .bsp-tooltip-content {
    opacity: 1;
  }
  .bsp-tooltip-wrapper:hover .bsp-tooltip-content.top {
    transform: translateX(-50%) translateY(0);
  }
  .bsp-tooltip-wrapper:hover .bsp-tooltip-content.bottom {
    transform: translateX(-50%) translateY(0);
  }
  .bsp-tooltip-wrapper:hover .bsp-tooltip-content.left {
    transform: translateY(-50%) translateX(0);
  }
  .bsp-tooltip-wrapper:hover .bsp-tooltip-content.right {
    transform: translateY(-50%) translateX(0);
  }
`;

function injectTooltipStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-tooltip-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-tooltip-styles';
    el.textContent = tooltipCss;
    document.head.appendChild(el);
  }
}

export default function Tooltip({
  content,
  position = 'top',
  children,
  style: extraStyle = {},
}) {
  injectTooltipStyles();

  const pos = ['top', 'bottom', 'left', 'right'].includes(position) ? position : 'top';

  return (
    <span className="bsp-tooltip-wrapper" style={extraStyle}>
      {children}
      <span className={`bsp-tooltip-content ${pos}`}>
        {content}
      </span>
    </span>
  );
}
