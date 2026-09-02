/* @ds-bundle: {"format":4,"namespace":"AlmayyaDesignSystem_fd8d10","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"StatChip","sourcePath":"components/core/StatChip.jsx"},{"name":"StepIndicator","sourcePath":"components/core/StepIndicator.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"1c86a6f2fc9c","components/core/Button.jsx":"c27f2c86085b","components/core/Card.jsx":"23f6b4293159","components/core/StatChip.jsx":"1a2f67eed9f5","components/core/StepIndicator.jsx":"50c418e51925","components/core/Tag.jsx":"48cac13e4cbe","components/forms/Input.jsx":"5930a13e7f4c","components/forms/Select.jsx":"b0940861bc63"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AlmayyaDesignSystem_fd8d10 = window.AlmayyaDesignSystem_fd8d10 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function Avatar({
  src,
  alt,
  size = 64
}) {
  return React.createElement('div', {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'var(--sand-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, src ? React.createElement('img', {
    src,
    alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : React.createElement('span', {
    style: {
      color: 'var(--text-muted)',
      fontSize: size * 0.35
    }
  }, (alt || '?').slice(0, 1)));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'var(--font-sans-body)',
    fontWeight: 500,
    letterSpacing: '0.02em',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 'var(--radius-md)',
    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease'
  };
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: 'var(--text-small)'
    },
    md: {
      padding: '12px 24px',
      fontSize: 'var(--text-body)'
    },
    lg: {
      padding: '16px 32px',
      fontSize: 'var(--text-body-lg)'
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent-cta)',
      color: 'var(--ivory)'
    },
    'primary-hover': {
      background: 'var(--accent-cta-hover)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--ivory)',
      border: '1px solid var(--border-inverse)'
    },
    'secondary-hover': {
      background: 'rgba(247,243,234,0.08)'
    },
    'secondary-light': {
      background: 'transparent',
      color: 'var(--forest-900)',
      border: '1px solid var(--border-subtle)'
    },
    'secondary-light-hover': {
      background: 'var(--bg-muted)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--forest-900)',
      border: 'none'
    },
    'ghost-hover': {
      color: 'var(--copper)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const vKey = hover ? variants[variant + '-hover'] ? variant + '-hover' : variant : variant;
  return React.createElement('button', {
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...(hover ? variants[variant + '-hover'] : {}),
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  padding = '24px',
  style
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--border-subtle)',
      padding,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/StatChip.jsx
try { (() => {
function StatChip({
  icon,
  value,
  label,
  tone = 'dark'
}) {
  const isDark = tone === 'dark';
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans-body)'
    }
  }, [React.createElement('span', {
    key: 'i',
    style: {
      fontSize: 20
    }
  }, icon), React.createElement('div', {
    key: 't'
  }, [React.createElement('div', {
    key: 'v',
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: '20px',
      color: isDark ? 'var(--ivory)' : 'var(--forest-900)',
      lineHeight: 1.1
    }
  }, value), React.createElement('div', {
    key: 'l',
    style: {
      fontSize: '12px',
      color: isDark ? 'var(--text-muted-inverse)' : 'var(--text-muted)'
    }
  }, label)])]);
}
Object.assign(__ds_scope, { StatChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatChip.jsx", error: String((e && e.message) || e) }); }

// components/core/StepIndicator.jsx
try { (() => {
function StepIndicator({
  number,
  title,
  description,
  active = false
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: 'var(--font-sans-body)'
    }
  }, [React.createElement('div', {
    key: 'n',
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: active ? 'var(--copper)' : 'var(--forest-900)',
      color: 'var(--ivory)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-serif-display)',
      fontSize: 16
    }
  }, number), React.createElement('div', {
    key: 't',
    style: {
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }, title), description && React.createElement('div', {
    key: 'd',
    style: {
      fontSize: 'var(--text-small)',
      color: 'var(--text-muted)'
    }
  }, description)]);
}
Object.assign(__ds_scope, { StepIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StepIndicator.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  tone = 'sage'
}) {
  const tones = {
    sage: {
      background: 'var(--sage-100)',
      color: 'var(--forest-900)'
    },
    sand: {
      background: 'var(--sand-100)',
      color: 'var(--charcoal)'
    },
    copper: {
      background: 'var(--copper-100)',
      color: 'var(--copper-600)'
    },
    dark: {
      background: 'rgba(247,243,234,0.1)',
      color: 'var(--ivory)'
    },
    forest: {
      background: 'var(--forest-900)',
      color: 'var(--ivory)'
    }
  };
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-small)',
      fontFamily: 'var(--font-sans-body)',
      fontWeight: 500,
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = 'text',
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans-body)',
      fontSize: 'var(--text-small)',
      color: 'var(--text-primary)',
      ...style
    }
  }, [label && React.createElement('span', {
    key: 'l'
  }, label), React.createElement('input', {
    key: 'i',
    type,
    placeholder,
    style: {
      padding: '12px 14px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans-body)',
      fontSize: 'var(--text-body)',
      background: 'var(--white)',
      outline: 'none'
    }
  })]);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans-body)',
      fontSize: 'var(--text-small)',
      color: 'var(--text-primary)',
      ...style
    }
  }, [label && React.createElement('span', {
    key: 'l'
  }, label), React.createElement('select', {
    key: 's',
    style: {
      padding: '12px 14px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans-body)',
      fontSize: 'var(--text-body)',
      background: 'var(--white)'
    }
  }, options.map((o, i) => React.createElement('option', {
    key: i
  }, o)))]);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatChip = __ds_scope.StatChip;

__ds_ns.StepIndicator = __ds_scope.StepIndicator;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();
