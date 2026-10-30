import React, { useEffect, useRef, useState } from 'react';

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Cloudflare test key (always passes)

export default function TurnstileWidget({ onVerify, onExpire, onError, theme = 'dark' }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check if Turnstile script is already injected
    const SCRIPT_ID = 'cf-turnstile-script';
    let script = document.getElementById(SCRIPT_ID);

    const onScriptLoad = () => {
      setIsLoaded(true);
    };

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = onScriptLoad;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      setIsLoaded(true);
    } else {
      script.addEventListener('load', onScriptLoad);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', onScriptLoad);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) return;

    try {
      // Clear previous widget if exists
      if (widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        callback: (token) => {
          if (onVerify) onVerify(token);
        },
        'expired-callback': () => {
          if (onExpire) onExpire();
        },
        'error-callback': (err) => {
          console.warn('[TURNSTILE] Security challenge error:', err);
          if (onError) onError(err);
        },
      });
    } catch (err) {
      console.warn('[TURNSTILE] Widget render warning:', err);
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isLoaded, theme]);

  return (
    <div className="my-3 flex flex-col items-center justify-center">
      <div ref={containerRef} className="min-h-[65px]" />
      <span className="text-[10px] text-slate-500 font-mono mt-1">
        Secured by Cloudflare Turnstile
      </span>
    </div>
  );
}
