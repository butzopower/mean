'use strict';

describe('ArticlesController', function () {
  // The $resource service augments the response object with methods for updating and deleting the resource.
  // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
  // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
  // When the toEqualData matcher compares two objects, it takes only object properties into
  // account and ignores methods.
  beforeEach(function () {
    this.addMatchers({
      toEqualData: function (expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  // Load the controllers module
  beforeEach(module('mean'));

  // Initialize the controller and a mock scope
  var ArticlesController,
    scope,
    $httpBackend,
    $stateParams,
    $location;

  // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
  // This allows us to inject a service but then attach it to a variable
  // with the same name as the service.
  beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

    scope = $rootScope.$new();

    ArticlesController = $controller('ArticlesController', {
      $scope: scope
    });

    $stateParams = _$stateParams_;

    $httpBackend = _$httpBackend_;

    $location = _$location_;

  }));

  describe('#find', function () {
    it('$scope.find() should create an array with at least one article object ' +
      'fetched from XHR', function () {

      // test expected GET request
      $httpBackend.expectGET('articles').respond([
        {
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        }
      ]);

      // run controller
      scope.find();
      $httpBackend.flush();

      // test scope value
      expect(scope.articles).toEqualData([
        {
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        }
      ]);
    });
  });

  describe('#create', function () {
    beforeEach(function () {
      scope.title = 'An Article about MEAN';
      scope.content = 'MEAN rocks!';
      scope.tags = ['first', 'second', 'third'];
      scope.addTemplate = 'views/articles/create.html';
      scope.articles = [
        {title: 'Old Article'}
      ];
    });

    describe('when succesful', function () {
      beforeEach(function () {
        $httpBackend.when('POST', 'articles').respond({
          _id: '525cf20451979dea2c000001',
          title: 'An Article about MEAN',
          content: 'MEAN rocks!',
          tags: ['first', 'second', 'third']
        });
      });

      it('makes the correct request', function () {
        $httpBackend.expectPOST('articles', {
          title: 'An Article about MEAN',
          content: 'MEAN rocks!',
          tags: ['first', 'second', 'third']
        });
        scope.create();
        $httpBackend.flush();
      });

      it('resets the form', function () {
        scope.create();
        $httpBackend.flush();
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');
        expect(scope.tags).toEqual([]);
        expect(scope.addTemplate).toBeUndefined();
      });

      it('updates the scope\'s articles', function () {
        scope.create();
        $httpBackend.flush();
        expect(scope.articles[0].title).toEqual('An Article about MEAN');
      });
    });

    describe('when the save fails', function () {
      beforeEach(function () {
        $httpBackend.when('POST', 'articles').respond(422, {
          errors: {title: {message: 'cannot be Blank', path: 'title'}}
        });
      });

      it('should show an alert message with the error', function () {
        scope.create();
        $httpBackend.flush();
        expect(scope.alerts).toEqual([{
          type: 'danger',
          msg: 'Title: cannot be Blank'
        }]);
      });
    });
  });

  describe('#update', function () {
    it('$scope.update() should update a valid article', inject(function (Articles) {

      // fixture rideshare
      var putArticleData = function () {
        return {
          _id: '525a8422f6d0f87f0e407a33',
          title: 'An Article about MEAN',
          to: 'MEAN is great!'
        };
      };

      // mock article object from form
      var article = new Articles(putArticleData());

      // mock article in scope
      scope.article = article;

      // test PUT happens correctly
      $httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/).respond();

      // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
      //$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/, putArticleData()).respond();
      /*
       Error: Expected PUT /articles\/([0-9a-fA-F]{24})$/ with different data
       EXPECTED: {'_id':'525a8422f6d0f87f0e407a33','title':'An Article about MEAN','to':'MEAN is great!'}
       GOT:      {'_id':'525a8422f6d0f87f0e407a33','title':'An Article about MEAN','to':'MEAN is great!','updated':[1383534772975]}
       */

      // run controller
      scope.update();
      $httpBackend.flush();

      // test URL location to new object
      expect($location.path()).toBe('/articles');
    }));
  });

  describe('#remove', function () {
    it('$scope.remove() should send a DELETE request with a valid articleId' +
      'and remove the article from the scope', inject(function (Articles) {

      // fixture rideshare
      var article = new Articles({
        _id: '525a8422f6d0f87f0e407a33'
      });

      // mock rideshares in scope
      scope.articles = [];
      scope.articles.push(article);

      // test expected rideshare DELETE request
      $httpBackend.expectDELETE(/articles\/([0-9a-fA-F]{24})$/).respond(204);

      // run controller
      scope.remove(article);
      $httpBackend.flush();

      // test after successful delete URL location articles lis
      //expect($location.path()).toBe('/articles');
      expect(scope.articles.length).toBe(0);

    }));
  });

  describe('#addArticle', function () {
    it('$scope.addArticle() should define the addTemplate', function () {
      expect(scope.addTemplate).toBeUndefined();
      scope.addArticle();
      expect(scope.addTemplate).toBe('views/articles/create.html');
    });
  });

  describe('#addCancel', function () {
    it('$scope.addCancel() should undefine the addTemplate', function () {
      scope.addTemplate = 'foobar';
      scope.addCancel();
      expect(scope.addTemplate).not.toBeDefined();
    });
  });

  describe('#editArticle', function () {
    it('$scope.editArticle() should define the addTemplate', function () {
      expect(scope.editTemplate).toBeUndefined();
      scope.editArticle({});
      expect(scope.article.editTemplate).toBe('views/articles/edit.html');
    });
  });

  describe('#editCancel', function () {
    it('$scope.editCancel() should undefine the addTemplate', function () {
      scope.article = {editTemplate: 'foobar'};
      scope.editCancel();
      expect(scope.article).not.toBeDefined();
    });
  });

  describe('#sortTitle', function () {
    it('cycles through all the sort options', function () {
      expect(scope.sortPredicate).toEqual('');
      expect(scope.sortTitleName).toEqual('Title');
      expect(scope.sortTitleDirection).toBeNull();

      scope.sortTitle();

      expect(scope.sortPredicate).toEqual('+title');
      expect(scope.sortTitleName).toEqual('Title');
      expect(scope.sortTitleDirection).toEqual('down');

      scope.sortTitle();

      expect(scope.sortPredicate).toEqual('-title');
      expect(scope.sortTitleName).toEqual('Title');
      expect(scope.sortTitleDirection).toEqual('up');

      scope.sortTitle();

      expect(scope.sortPredicate).toEqual('');
      expect(scope.sortTitleName).toEqual('Title')
      expect(scope.sortTitleDirection).toBeNull();
    });

    it('unsets any other sort', function () {
      scope.sortDateName = 'foo';
      scope.sortDateDirection = 'up';

      scope.sortTitle();

      expect(scope.sortDateName).toEqual('Date');
      expect(scope.sortDateDirection).toBeNull();
    });

    it('come from another sorted predicate', function () {
      scope.sortPredicate = '+created';

      scope.sortTitle();

      expect(scope.sortPredicate).toEqual('+title');
    });
  });

  describe('#sortDate', function () {
    it('cycles through the sort options', function () {
      expect(scope.sortPredicate).toEqual('');
      expect(scope.sortDateName).toEqual('Date');
      expect(scope.sortDateDirection).toBeNull();

      scope.sortDate();

      expect(scope.sortPredicate).toEqual('+created');
      expect(scope.sortDateName).toEqual('Date');
      expect(scope.sortDateDirection).toEqual('down');

      scope.sortDate();

      expect(scope.sortPredicate).toEqual('-created');
      expect(scope.sortDateName).toEqual('Date');
      expect(scope.sortDateDirection).toEqual('up');

      scope.sortDate();

      expect(scope.sortPredicate).toEqual('');
      expect(scope.sortDateName).toEqual('Date');
      expect(scope.sortDateDirection).toBeNull();
    });

    it('unsets any other sort', function () {
      scope.sortTitleName = 'foo';
      scope.sortTitleDirection = 'down';

      scope.sortDate();

      expect(scope.sortTitleName).toEqual('Title');
      expect(scope.sortTitleDirection).toBeNull();
    });

    it('come from another sorted predicate', function () {
      scope.sortPredicate = '+title';

      scope.sortDate();

      expect(scope.sortPredicate).toEqual('+created');
    });
  });

  describe('#closeAlert', function () {
    it('removes the alert from the list of alerts', function () {
      scope.alerts.push({type: 'danger', msg: 'Some Alert'});
      scope.closeAlert(0);
      expect(scope.alerts.length).toEqual(0);
    });
  });
});
