angular.module('app').controller('mainCtrl', function ($scope) {
  $scope.courses = [
    { title: 'Ruby on Rails Tutorial', published: new Date(2017, 9, 10), featured: true },
    { title: 'Rails Caching', published: new Date(2017, 9, 11), featured: true },
    { title: 'Rails with AngularJS', published: new Date(2017, 9, 11), featured: true },
    { title: 'Node.js', published: new Date(2017, 9, 11), featured: true },
    { title: 'MEAN Stack', published: new Date(2017, 9, 12), featured: true },
    { title: 'AngularJS', published: new Date(2017, 9, 12), featured: true },
    { title: 'MongoDB', published: new Date(2017, 9, 13), featured: true },
    { title: 'React.js', published: new Date(2017, 9, 13), featured: false },
    { title: 'Vue.js', published: new Date(2017, 9, 13), featured: false },
    { title: 'EcmaScript 6', published: new Date(2017, 9, 13), featured: true },
    { title: 'SCSS', published: new Date(2017, 9, 15), featured: true },
    { title: 'Bootstrap', published: new Date(2017, 9, 15), featured: true },
    { title: 'AngularJS Advanced Topics', published: new Date(2017, 9, 15), featured: true },
    { title: 'CoffeeScript', published: new Date(2017, 9, 16), featured: true },
    { title: 'TypeScript', published: new Date(2017, 9, 16), featured: false },
    { title: 'AngularJS 2', published: new Date(2017, 9, 17), featured: false },
    { title: 'AngularJS 4', published: new Date(2017, 9, 17), featured: false },
    { title: 'WebPack', published: new Date(2017, 9, 17), featured: true },
    { title: 'Yarn', published: new Date(2017, 9, 17), featured: true },
    { title: 'Go', published: new Date(2017, 9, 17), featured: false }
  ];
});
