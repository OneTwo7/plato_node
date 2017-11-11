var auth    = require('../auth');
var lessons = require('../../app/controllers/lessons');
var router  = require('express').Router({ mergeParams: true });

router.get('/', lessons.getLessonsByCourseId);

router.get('/:lesson_id', lessons.getLessonById);

router.post('/', auth.requiresRole('admin'), lessons.createLesson);

router.put('/:lesson_id', auth.requiresRole('admin'), lessons.updateLesson);

router.delete('/:lesson_id', auth.requiresRole('admin'), lessons.deleteLesson);

module.exports = router;
