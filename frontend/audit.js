(function () {
  const STORAGE_KEY = 'auditLogs';
  const MAX_LOGS = 1000;
  const PAGE_ACTIONS = {
    'index.html': 'Visitó la página de inicio',
    'login.html': 'Visitó inicio de sesión',
    'register.html': 'Visitó registro',
    'welcome.html': 'Ingresó a la app',
    'profile.html': 'Visitó el perfil',
    'perfumes.html': 'Visitó la página de perfumes',
    'cart.html': 'Visitó el carrito',
    'factura.html': 'Visitó factura',
    'devoluciones.html': 'Visitó la página de devoluciones',
    'admin.html': 'Accedió al panel de admin',
    'add-product.html': 'Accedió a agregar producto',
    'admin-pedidos.html': 'Visitó admin de pedidos',
    'admin-inventario.html': 'Visitó admin de inventario',
    'admin-activity.html': 'Visitó activity log'
  };

  function getUsuario() {
    try {
      return JSON.parse(localStorage.getItem('usuario'));
    } catch (e) {
      return null;
    }
  }

  function getLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveLogs(logs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
  }

  function log(action, meta) {
    const usuario = getUsuario();
    if (!usuario) return;

    const logs = getLogs();
    const entry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      fecha: new Date().toISOString(),
      accion: action,
      pagina: (window.location.pathname || '').split('/').pop() || 'desconocida',
      usuario: usuario.nombre || 'Usuario',
      email: usuario.email || 'sin-email',
      rol: usuario.rol || 'usuario',
      meta: meta || null
    };

    logs.unshift(entry);
    saveLogs(logs);
  }

  function logOncePerPage(action) {
    if (!action) return;
    try {
      const page = (window.location.pathname || '').split('/').pop() || 'desconocida';
      const key = `audit_once_${page}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      log(action);
    } catch (e) {
      log(action);
    }
  }

  window.AuditLogger = {
    log,
    getLogs,
    logOncePerPage
  };

  const lastEventMap = new Map();
  function shouldLog(key, windowMs = 1000) {
    const now = Date.now();
    const last = lastEventMap.get(key) || 0;
    if (now - last < windowMs) return false;
    lastEventMap.set(key, now);
    return true;
  }

  function getTargetInfo(target) {
    if (!target) return null;
    const el = target.closest ? target.closest('a,button,input,select,textarea,[role="button"]') : target;
    if (!el) return null;
    const text = (el.innerText || el.value || '').trim().slice(0, 80);
    return {
      tag: el.tagName ? el.tagName.toLowerCase() : 'unknown',
      id: el.id || null,
      name: el.name || null,
      class: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join(' ') : null,
      text
    };
  }

  function isSensitiveField(el) {
    if (!el) return false;
    const type = (el.type || '').toLowerCase();
    const name = (el.name || '').toLowerCase();
    return type === 'password' || name.includes('password') || name.includes('clave');
  }

  document.addEventListener('click', (e) => {
    const info = getTargetInfo(e.target);
    if (!info) return;
    const key = `click:${info.tag}:${info.id || info.name || info.text}`;
    if (!shouldLog(key)) return;
    const href = e.target && e.target.closest ? e.target.closest('a')?.getAttribute('href') : null;
    log('Click', { target: info, href: href || null });
  }, true);

  document.addEventListener('submit', (e) => {
    const form = e.target;
    const key = `submit:${form?.id || form?.name || 'form'}`;
    if (!shouldLog(key)) return;
    log('Submit formulario', {
      form: {
        id: form?.id || null,
        name: form?.name || null,
        action: form?.action || null
      }
    });
  }, true);

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (!el || !['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) return;
    const key = `change:${el.name || el.id || el.tagName}`;
    if (!shouldLog(key, 1500)) return;
    log('Cambio de campo', {
      field: {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        name: el.name || null,
        value: isSensitiveField(el) ? '[oculto]' : (el.value || '').toString().slice(0, 120)
      }
    });
  }, true);

  window.addEventListener('error', (e) => {
    const key = `error:${e.message}`;
    if (!shouldLog(key, 2000)) return;
    log('Error JS', {
      message: e.message,
      source: e.filename,
      line: e.lineno,
      column: e.colno
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = (e.reason && e.reason.message) ? e.reason.message : String(e.reason || '');
    const key = `unhandled:${reason}`;
    if (!shouldLog(key, 2000)) return;
    log('Promise rechazada', { reason });
  });

  const page = (window.location.pathname || '').split('/').pop() || '';
  const autoAction = PAGE_ACTIONS[page];
  if (autoAction) {
    logOncePerPage(autoAction);
  }
})();
