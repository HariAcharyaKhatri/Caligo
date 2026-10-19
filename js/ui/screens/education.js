window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';
  var h = C.dom.h, S = C.state, UI = C.ui, A = C.actions, U = C.util, D = C.data;

  C.screens = C.screens || {};
  C.screens.education = {
    render: function () {
      var sv = C.state.save;
      var root = h('div');
      root.appendChild(UI.pageHead('Education', [{ label: 'City', onClick: function () { C.router.go('city'); } }]));

      if (sv.education.active) {
        var course = S.courseById(sv.education.active);
        var progBar = UI.progress(0);
        var info = h('div', { class: 'small' });
        root.appendChild(UI.section('Active course', [
          h('p', { text: course.name + ' — ' + course.bonus }),
          info, progBar,
          h('div', { class: 'row', style: { marginTop: '8px' } },
            h('button', { class: 'small danger', text: 'Cancel (50% refund)',
              onclick: function () {
                UI.confirm('Cancel ' + course.name + '?', function () {
                  A.cancelCourse(); C.router.go('education');
                });
              }
            })
          )
        ]));
        function upd() {
          var pct = A.courseProgress(course.id);
          C.dom.setText(info, Math.round(pct * 100) + '% complete');
          progBar.firstChild.style.width = (pct * 100) + '%';
        }
        upd();
        C.engine.live(upd);
      } else {
        root.appendChild(UI.section('Enrolment', [
          h('p', { class: 'small muted', text: 'Take one course at a time. Courses run on real time (game time). Complete courses to unlock permanent bonuses.' })
        ]));
      }

      D.education.forEach(function (cat) {
        var body = h('div', { class: 'card-grid' });
        cat[1].forEach(function (c) {
          var course = D.eduCourses[c[0]];
          var done = S.courseCompleted(sv, course.id);
          var locked = course.prereq !== 'none' && !S.courseCompleted(sv, course.prereq);
          var card = h('div', { class: 'tile', style: { cursor: 'default', textAlign: 'left', alignItems: 'flex-start', minHeight: '110px' } },
            h('div', { class: 'tile-name', text: course.name }),
            h('div', { class: 'tile-sub', text: course.bonus }),
            h('div', { class: 'small muted', text: course.hours + 'h · ' + U.money(course.cost) }),
            done
              ? h('div', { class: 'small good', text: '✓ Completed' })
              : locked
                ? h('div', { class: 'small bad', text: 'Locked — ' + D.eduCourses[course.prereq].name })
                : h('button', { class: 'small blue', text: 'Enrol', style: { marginTop: '6px' },
                    onclick: function () {
                      UI.confirm('Enrol in ' + course.name + ' for ' + U.money(course.cost) + '?', function () {
                        var r = A.enrolCourse(course.id);
                        if (!r.ok) { UI.toast(r.reason, 'bad'); return; }
                        UI.toast('Enrolled.', 'good');
                        C.router.go('education');
                      });
                    }
                  })
          );
          body.appendChild(card);
        });
        root.appendChild(UI.section(cat[0], [body]));
      });

      return root;
    }
  };
})(window.CALIGO);
