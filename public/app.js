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
      screen.textContent = '';
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
      screen.appendChild(el);
      document.getElementById('stage-text').textContent = it.text;
      var link = document.getElementById('stage-link');
      link.href = it.href;
      link.textContent = it.label + ' ↗';
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
