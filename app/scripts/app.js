angular.module('myApp', ['ngAnimate', 'ngRoute', 'app.homePages','app.ghAPI'])

  .constant('TPL_PATH', '/templates')

  .config(function($routeProvider, $locationProvider, TPL_PATH) {
    $locationProvider.hashPrefix('!');
    $routeProvider
      .when('/',{
        controller : 'ReposCtrl',
        templateUrl : TPL_PATH + '/repos.html',
        reloadOnSearch : false
      })
      .when('/repo/:owner/:repo',{
        controller : 'RepoCtrl',
        templateUrl : TPL_PATH + '/repo.html',
        reloadOnSearch : false,
        resolve : {
          repoData : function($location, ghRepo) {
            var params = $location.path().match(/repo\/([^\/]+)\/([^\/]+)/);
            return ghRepo(params[1], params[2]);
          }
        }
      })
  })

  .run(function($rootScope, itemHistory) {
    $rootScope.history = itemHistory;
  })

  .factory('itemHistory', function() {
    var items = [];
    return {
      push : function(item) {
        var newItems = [];
        for(var i=0;i<items.length;i++) {
          if(items[i].id == item.id) {
            continue;
          }
          newItems.push(items[i]);
        }
        items = newItems;
        items.push(item);
      },
      list : function() {
        return items;
      }
    }
  })

  .filter('itemHistory', function() {
    return function(data) {
      var items = [];
      for(var i=data.length-1, j = 0; i >= 0 && j < 10; i--, j++) {
        items.push(data[i]);
      }
      return items;
    }
  })

  .controller('StatusCtrl', function($scope) {
    $scope.$on('ghRateLimitExceeded', function() {
      $scope.rateExceeded = true;
    });
    $scope.$on('ghRequestSuccess', function() {
      $scope.rateExceeded = false;
    });
  })

  .controller('SearchCtrl', function($location, $scope, $timeout) {
    var VALID_INPUT_WAIT_DELAY = 200;

    var searchTimer;
    $scope.search = function(q) {
      searchTimer && $timeout.cancel(searchTimer);
      searchTimer = $timeout(function() { 
        $location.path('/').search({
          q : q
        });
      }, VALID_INPUT_WAIT_DELAY);
    };

    $scope.$on('titleChange', function(event, text, isSearch) {
      $scope.isSearch = true;
      $scope.q = text;
    });
  })

  .controller('CollaboratorsCtrl', function($scope) {
    $scope.getClass = function(user, search) {
      return !search || search.length == 0 || user.login.indexOf(search) >= 0 ?
        'selected' :
        'other';
    }
  })

  .controller('RepoCtrl', function($scope, $rootScope, repoData, itemHistory, ghRepoCollaborators, ghRepoCommits, ghRepoReadme, ghRepoPullRequests, ghRepoIssues) {
    itemHistory.push(repoData);

    $scope.repo = repoData;

    $rootScope.$broadcast('titleChange', repoData.full_name);

    $scope.issuesOrPullRequests = function(type) {
      return type == 'issues' ?
        $scope.issues : 
        $scope.pullRequests;
    };

    ghRepoCollaborators(repoData.owner.login, repoData.name).then(function(items) {
      $scope.collaborators = items;
    });

    ghRepoCommits(repoData.owner.login, repoData.name).then(function(commits) {
      $scope.commits = commits;
    });

    ghRepoReadme(repoData.owner.login, repoData.name).then(function(readme) {
      $scope.readme = readme;
    });

    ghRepoPullRequests(repoData.owner.login, repoData.name).then(function(data) {
      $scope.pullRequests = data;
    });

    ghRepoIssues(repoData.owner.login, repoData.name).then(function(data) {
      $scope.issues = data;
    });

    $scope.repoUrl = function(path) {
      return 'repo/' + $scope.repo.full_name + path;
    };
  })

  .factory('parameterize', function() {
    return function(text) {
      return text.replace(/[^-\w]/g,'-');
    }
  })

  .directive('subNavComponent', function($location, $anchorScroll, parameterize, TPL_PATH) {
    return {
      scope : {
        indexTemplate : '@subNavIndexTemplate'
      },
      controller : function($scope) {
        var hash = $location.hash();
        if(!hash || hash.length == 0) {
          $location.hash('index');
        }

        $scope.$watch(
          function() { return $location.hash(); },
          function(page) {
            var template = page == 'index' ?
              $scope.indexTemplate :
              page;
            $scope.selected = page;
            $scope.template = TPL_PATH + '/' + parameterize(template) + '.html';
            $anchorScroll();
          });
      }
    };
  })

  .controller('HistoryCtrl', function($scope) {
  })

  .controller('ReposCtrl', function($scope, $rootScope, $location, ghRepos, $routeParams) {
    $scope.searchRepos = function(q) {
      $scope.repos = [];
      ghRepos(q).then(function(items) {
        $scope.repos = items;
      });
    };

    $scope.$watch(
      function() { return $location.search().q; },
      function(q) {
        $scope.searchRepos(q || 'angular');
        $rootScope.$broadcast('titleChange', q, true);
      });
  });
