const mongoose = require('mongoose');
const UserModel = require('../app/models/User');
const CourseModel = require('../app/models/Course');
const LessonModel = require('../app/models/Lesson');

module.exports = function (config) {

    mongoose.Promise = global.Promise;

    mongoose.connect(config.db, { useMongoClient: true })
        .then(() => {
            const db = mongoose.connection;

            db.once('open', function () {
                console.log('connected to db');
            });
    
            UserModel.createDefaultUsers();
    
            CourseModel.createDefaultCourses();
    
            LessonModel.createDefaultLessons();
        })
        .catch(err => {
            console.log(err);
        });

};
