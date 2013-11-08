describe('Repo Page', function() {

  it('should have a list of collaborators with images', function() {
    browser.get('#!/repo/angular/angular.js').then(function() {
      expect(element.all(by.repeater('collab in collaborators')).count()).toBeGreaterThan(0);
    });
  });

  it('should select the image when data is typed into the search box', function() {

  });

});
