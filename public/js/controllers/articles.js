'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles', function ($scope, $stateParams, $location, Global, Articles) {
  $scope.global = Global;

  $scope.sortTitleName = 'Title';
  $scope.sortDateName = 'Date';
  $scope.sortTitleDirection = null;
  $scope.sortDateDirection = null;
  $scope.sortPredicate = '';
  $scope.alerts = [];


  $scope.create = function () {
    var article = new Articles({
      title: this.title,
      content: this.content,
      tags: this.tags
    });
    article.$save(function (response) {
      $scope.articles.unshift(response);
      $scope.addTemplate = undefined;
    }, function (httpResponse) {
      var msg = '';
      angular.forEach(httpResponse.data.errors, function(error) {
        error.path = error.path.charAt(0).toUpperCase() + error.path.slice(1);
        msg += error.path + ': ' + error.message;
      });

      $scope.alerts.push({
        type: 'danger',
        msg: msg
      });
    });

    this.title = '';
    this.content = '';
    this.tags = [];
  };

  $scope.remove = function (article) {
    if (article) {
      article.$remove();

      for (var i in $scope.articles) {
        if ($scope.articles[i] === article) {
          $scope.articles.splice(i, 1);
        }
      }
    }
  };

  $scope.update = function () {
    var article = $scope.article;
    if (!article.updated) {
      article.updated = [];
    }
    article.updated.push(new Date().getTime());

    article.$update(function () {
      $location.path('articles');
    });
  };

  $scope.find = function () {
    Articles.query(function (articles) {
      $scope.articles = articles;
    });
  };

  $scope.addArticle = function () {
    $scope.addTemplate = 'views/articles/create.html';
  };

  $scope.addCancel = function () {
    $scope.addTemplate = undefined;
  };

  $scope.editArticle = function (article) {
    $scope.article = article;
    $scope.article.editTemplate = 'views/articles/edit.html';
  };

  $scope.editCancel = function () {
    $scope.article.editTemplate = undefined;
    $scope.article = undefined;
  };

  $scope.sortTitle = function () {
    $scope.sortDateName = 'Date';
    $scope.sortDateDirection = null;

    if ($scope.sortPredicate === '' || $scope.sortPredicate.indexOf('created') > 0) {
      $scope.sortPredicate = '+title';
      $scope.sortTitleName = 'Title';
      $scope.sortTitleDirection = 'down';
    } else if ($scope.sortPredicate === '+title') {
      $scope.sortPredicate = '-title';
      $scope.sortTitleName = 'Title';
      $scope.sortTitleDirection = 'up';
    } else {
      $scope.sortPredicate = '';
      $scope.sortTitleName = 'Title';
      $scope.sortTitleDirection = null;
    }
  };

  $scope.sortDate = function () {
    $scope.sortTitleName = 'Title';
    $scope.sortTitleDirection = null;

    if ($scope.sortPredicate === '' || $scope.sortPredicate.indexOf('title') > 0) {
      $scope.sortPredicate = '+created';
      $scope.sortDateName = 'Date';
      $scope.sortDateDirection = 'down';
    } else if ($scope.sortPredicate === '+created') {
      $scope.sortPredicate = '-created';
      $scope.sortDateName = 'Date';
      $scope.sortDateDirection = 'up';
    } else {
      $scope.sortPredicate = '';
      $scope.sortDateName = 'Date';
      $scope.sortDateDirection = null;
    }
  };

  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.anyArticles = function () {
    return $scope.articles && $scope.articles.length;
  };
}]);
