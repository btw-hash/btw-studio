(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    document.querySelectorAll('video').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.controls = true;
    });
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
      el.classList.add('in');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          e.target.classList.add('in');
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

  document.querySelectorAll('a.item').forEach(function (a) {
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
          who: form.elements.who.value,
          what: what.value,
          when: form.elements.when.value,
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
