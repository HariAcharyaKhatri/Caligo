/* CALIGO — education actions. */
window.CALIGO = window.CALIGO || {};
(function (C) {
  'use strict';

  var U = C.util, S = C.state, A = C.actions;
  function save() { return C.state.save; }

  A.enrolCourse = function (courseId) {
    var sv = save();
    var check = S.canTakeCourse(sv, courseId);
    if (!check.ok) return check;
    var course = S.courseById(courseId);
    if (sv.player.cash < course.cost) return { ok: false, reason: 'Not enough cash.' };

    sv.player.cash -= course.cost;
    sv.education.active = courseId;
    sv.education.startedAt = sv.meta.gameTime;
    A.log('Enrolled in ' + course.name + ' (' + course.hours + ' game hours).', 'money');
    return { ok: true, course: course };
  };

  A.cancelCourse = function () {
    var sv = save();
    if (!sv.education.active) return { ok: false, reason: 'You are not taking a course.' };
    var course = S.courseById(sv.education.active);
    /* Refund half the cost. */
    var refund = Math.round(course.cost * 0.5);
    sv.player.cash += refund;
    A.log('Cancelled ' + course.name + '. Refunded ' + U.money(refund) + '.', 'info');
    sv.education.active = null;
    sv.education.startedAt = 0;
    return { ok: true };
  };

  /* Called from the engine tick. */
  A.checkCourseProgress = function () {
    var sv = save();
    if (!sv.education.active) return;
    var course = S.courseById(sv.education.active);
    if (!course) { sv.education.active = null; return; }
    var elapsed = sv.meta.gameTime - sv.education.startedAt;
    var needed = course.hours * 3600;
    if (elapsed >= needed) {
      sv.education.completed.push(course.id);
      sv.education.active = null;
      sv.education.startedAt = 0;
      sv.counters.coursesCompleted++;
      A.grantXp(20);
      A.log('Course complete: ' + course.name + '. ' + course.bonus + '.', 'good');
      A.pushMail('Registrar', 'Certificate issued: ' + course.name, 'Your certificate for ' + course.name + ' is on file.');
    }
  };

  A.courseProgress = function (courseId) {
    var sv = save();
    if (!sv.education.active || sv.education.active !== courseId) return 0;
    var course = S.courseById(courseId);
    var elapsed = sv.meta.gameTime - sv.education.startedAt;
    return Math.min(1, elapsed / (course.hours * 3600));
  };

  C.actions = A;
})(window.CALIGO);
