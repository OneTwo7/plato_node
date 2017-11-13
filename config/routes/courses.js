var auth    = require('../auth');
var courses = require('../../app/controllers/courses');
var router  = require('express').Router({ mergeParams: true });

router.get('/', courses.getCourses);

router.get('/unpublished', auth.requiresRole('admin'), courses.getUnpublishedCourses);

router.post('/', auth.requiresRole('admin'), courses.createCourse);

router.put('/:id', auth.requiresRole('admin'), courses.updateCourse);

router.delete('/:id', auth.requiresRole('admin'), courses.deleteCourse);

router.get('/:id', courses.getCourseById);

module.exports = router;
