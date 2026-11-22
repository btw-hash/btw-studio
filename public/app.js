(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    document.querySelectorAll('video').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.controls = true;
    });
  }

  var themeButton = document.getElementById('theme');
  if (themeButton) {
    var root = document.documentElement;
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    var isDark = function () {
      var chosen = root.getAttribute('data-theme');
      return chosen ? chosen === 'dark' : systemDark.matches;
    };
    var syncTheme = function () {
      var dark = isDark();
      themeButton.setAttribute('aria-pressed', dark ? 'true' : 'false');
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
        m.setAttribute('content', dark ? '#060607' : '#eef1f5');
      });
    };
    themeButton.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      var apply = function () {
        root.setAttribute('data-theme', next);
        try {
          localStorage.setItem('theme', next);
        } catch (e) {}
        syncTheme();
      };
      if (reduce) {
        apply();
        return;
      }
      if (!document.startViewTransition) {
        root.classList.add('fading');
        apply();
        setTimeout(function () {
          root.classList.remove('fading');
        }, 420);
        return;
      }
      var box = themeButton.getBoundingClientRect();
      var x = box.left + box.width / 2;
      var y = box.top + box.height / 2;
      var far = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty('--tx', x + 'px');
      root.style.setProperty('--ty', y + 'px');
      root.style.setProperty('--tr', far + 'px');
      root.classList.add('theming');
      var done = function () {
        root.classList.remove('theming');
      };
      document.startViewTransition(apply).finished.then(done, done);
    });
    if (systemDark.addEventListener) systemDark.addEventListener('change', syncTheme);
    syncTheme();
  }

  var bar = document.querySelector('.bar');
  if (bar) {
    var onScroll = function () {
      bar.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // an order button lands on the form: ring it once and, with a mouse, put the cursor in it
  var brief = document.getElementById('brief');
  if (brief) {
    document.querySelectorAll('a[href$="#brief"]').forEach(function (a) {
      a.addEventListener('click', function () {
        brief.classList.remove('ping');
        void brief.offsetWidth;
        brief.classList.add('ping');
        var field = document.getElementById('f-what');
        if (!field || !window.matchMedia('(pointer: fine)').matches) return;
        // after the jump: moving to the anchor takes the focus away
        setTimeout(function () {
          field.focus({ preventScroll: true });
        }, 60);
      });
    });
  }

  var clips = document.querySelector('.clips');
  if (clips && clips.children.length > 1) {
    var figs = clips.children;
    var dots = document.createElement('div');
    dots.className = 'dots';
    dots.setAttribute('aria-hidden', 'true');
    for (var d = 0; d < figs.length; d++) dots.appendChild(document.createElement('i'));
    clips.parentNode.insertBefore(dots, clips.nextSibling);
    var mark = function () {
      var best = 0;
      var x = clips.getBoundingClientRect().left;
      for (var k = 0; k < figs.length; k++) {
        if (
          Math.abs(figs[k].getBoundingClientRect().left - x) <
          Math.abs(figs[best].getBoundingClientRect().left - x)
        )
          best = k;
      }
      if (clips.scrollLeft + clips.clientWidth >= clips.scrollWidth - 2) best = figs.length - 1;
      for (var n = 0; n < figs.length; n++) dots.children[n].classList.toggle('on', n === best);
    };
    clips.addEventListener('scroll', mark, { passive: true });
    mark();
  }

  var stage = document.querySelector('[data-stage]');
  if (stage) {
    var items = JSON.parse(stage.getAttribute('data-stage'));
    var screen = document.getElementById('screen');
    var buttons = stage.querySelectorAll('.chan button');
    var show = function (i) {
      var it = items[i];
      while (screen.children.length > 1) screen.removeChild(screen.firstChild);
      var old = screen.firstElementChild;
      var el;
      if (it.video) {
        el = document.createElement('video');
        el.src = it.video;
        el.poster = it.poster;
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.setAttribute('aria-label', it.text);
        if (reduce) el.controls = true;
        else el.autoplay = true;
      } else {
        el = document.createElement('img');
        el.src = it.poster;
        el.alt = it.text;
      }
      el.className = 'shot';
      if (old && !reduce) {
        el.classList.add('enter');
        screen.appendChild(el);
        void el.offsetWidth;
        el.classList.remove('enter');
        setTimeout(function () {
          if (old.parentNode === screen && screen.lastElementChild !== old) screen.removeChild(old);
        }, 420);
      } else {
        screen.textContent = '';
        screen.appendChild(el);
      }
      // every caption and label sits in the same cell, so switching never changes the layout
      var says = document.getElementById('stage-text').children;
      for (var k = 0; k < says.length; k++) {
        says[k].classList.remove('swap');
        says[k].classList.toggle('on', k === i);
        if (k === i) says[k].removeAttribute('aria-hidden');
        else says[k].setAttribute('aria-hidden', 'true');
      }
      void says[i].offsetWidth;
      says[i].classList.add('swap');
      var link = document.getElementById('stage-link');
      link.href = it.href;
      for (var n = 0; n < link.children.length; n++) {
        var on = link.children[n].getAttribute('data-label') === it.label;
        link.children[n].classList.toggle('on', on);
        if (on) link.children[n].removeAttribute('aria-hidden');
        else link.children[n].setAttribute('aria-hidden', 'true');
      }
      document.getElementById('stage-more').href = it.more;
      buttons.forEach(function (b, k) {
        b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        show(Number(b.getAttribute('data-i')));
      });
    });
  }

  var countUp = function (td) {
    var m = /^(\d+)([.,]\d+)?(.*)$/.exec(td.textContent);
    if (!m) return;
    var sep = m[2] ? m[2].charAt(0) : '.';
    var digits = m[2] ? m[2].length - 1 : 0;
    var target = parseFloat(m[1] + (m[2] ? '.' + m[2].slice(1) : ''));
    var final = td.textContent;
    var start = null;
    var step = function (now) {
      if (start === null) start = now;
      var k = Math.min(1, (now - start) / 900);
      if (k === 1) {
        td.textContent = final;
        return;
      }
      var eased = 1 - Math.pow(1 - k, 3);
      td.textContent = (target * eased).toFixed(digits).replace('.', sep) + m[3];
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  var revealed = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || reduce) {
    revealed.forEach(function (el) {
      el.classList.add('seen');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          e.target.classList.add('seen');
          e.target.querySelectorAll('.proof td').forEach(countUp);
          setTimeout(function () {
            e.target.classList.add('done');
          }, 900);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealed.forEach(function (el) {
      io.observe(el);
    });
  }

  // a desktop-screen recording is unreadable at phone width: a tap opens it full screen
  document.addEventListener('click', function (e) {
    var v = e.target;
    if (!v || v.tagName !== 'VIDEO' || v.controls) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(function () {});
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
  });
  document.addEventListener('fullscreenchange', function () {
    document.querySelectorAll('video').forEach(function (v) {
      v.controls = document.fullscreenElement === v;
    });
  });

  var lazy = document.querySelectorAll('video[data-lazy]');
  if (lazy.length && 'IntersectionObserver' in window && !reduce) {
    var vio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.play().catch(function () {});
          else e.target.pause();
        });
      },
      { threshold: 0.25 }
    );
    lazy.forEach(function (v) {
      vio.observe(v);
    });
  } else {
    lazy.forEach(function (v) {
      v.controls = true;
    });
  }

  document.querySelectorAll('a.item.proj').forEach(function (a) {
    a.addEventListener('click', function () {
      var b = a.querySelector('b');
      if (b) b.style.viewTransitionName = 'ptitle';
    });
  });

  var form = document.getElementById('brief-form');
  if (form) {
    var msg = JSON.parse(form.getAttribute('data-msg'));
    var status = document.getElementById('brief-status');
    var say = function (text, isError) {
      status.textContent = text;
      status.className = 'status' + (isError ? ' err' : '');
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var what = form.elements.what;
      var reply = form.elements.reply;
      what.removeAttribute('aria-invalid');
      reply.removeAttribute('aria-invalid');
      var button = form.querySelector('button[type=submit]');
      button.disabled = true;
      say(msg.sending, false);
      fetch('/api/brief', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          what: what.value,
          reply: reply.value,
          website: form.elements.website.value,
          lang: form.getAttribute('data-lang'),
        }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            say(msg.ok, false);
            return;
          }
          var key = r.data && r.data.error;
          if (key === 'what') {
            what.setAttribute('aria-invalid', 'true');
            what.focus();
          }
          if (key === 'reply') {
            reply.setAttribute('aria-invalid', 'true');
            reply.focus();
          }
          say(msg[key] || msg.fail, true);
        })
        .catch(function () {
          say(msg.fail, true);
        })
        .then(function () {
          button.disabled = false;
        });
    });
  }
})();
