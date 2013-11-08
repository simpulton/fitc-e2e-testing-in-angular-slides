describe('App', function() {

  beforeEach(module('myApp'));

  describe('itemHistory factory', function() {

    it('should have working push and list functions', inject(function(itemHistory) {
      itemHistory.push({ id : 1, title:'yes' });
      expect(itemHistory.list()).toEqual([{ id :1, title:'yes'}]);

      itemHistory.push({ id : 2, title:'no' });
      expect(itemHistory.list()).toEqual([{ id :1, title:'yes'}, { id:2, title:'no' }]);

      itemHistory.push({ id : 2, title:'again' });
      expect(itemHistory.list()).toEqual([{ id :1, title:'yes'}, { id:2, title:'again' }]);
    }));

  });

  describe('ReposCtrl', function() {

    it('should have a working search', inject(function($rootScope, $controller, $compile, $location) {
      var scope = $rootScope.$new();
      $controller('ReposCtrl',{
        $scope : scope,
        ghRepos : function(q) {
          return {
            then : function(fn) {
              if(q == 'test') {
                return fn([1,2,3]);
              }
              else {
                return fn([4,5,6]);
              }
            }
          }
        }
      });

      scope.searchRepos('test');
      expect(scope.repos).toEqual([1,2,3]);

      $location.search().q = 'more';
      $rootScope.$digest();
      expect(scope.repos).toEqual([4,5,6]);
    }));

  });

  describe('StageCtrl', function() {

    it('should update the loading route when the event of the page changes', inject(function($filter) {

    }));

  });

  describe('itemHistory filter', function() {

    it('should provide the last ten or less values', inject(function($filter) {

    }));

  });

});
