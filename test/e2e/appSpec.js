describe('App', function() {

  describe('page requests', function() {

    it('should load the repos page', function() {
      browser.get('/#!');
      expect(element(by.id('view-container')).getText()).toMatch(/\d+ repos found/);
    });

    it('should load the repo page', function() {
      browser.get('#!/repo/angular/angular.js').then(function() {
        expect(element(by.id('view-container')).getText()).toContain('AngularJS');
      });
    });

  });

  describe('repos page', function() {

    it('should search for something', function() {
      browser.get('/#!/?q=angular').then(function() {
        expect(element(by.id('searcher')).getAttribute('value')).toEqual('angular');

        var match = element(by.repeater('repo in repos').row(0));
        expect(match.getText()).toContain('angular/angular.js');
      });
    });

  });

  describe('repo page', function() {
    it('should go to the repo page and test the input value to redirect the page', function() {

    });
  });

  describe('history items', function() {
    it('should jump from page to page and test against the list of history items', function() {

    });
  });

});
