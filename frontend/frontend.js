if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.hello.onRendered(function() {
    /* In your Template.xxx.rendered */
    // Set worker URL to package assets
    PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
    // Create PDF
    var url = 'http://arxiv.org/pdf/1601.07596.pdf'
    PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
      // Fetch the first page
      pdf.getPage(1).then(function getPageHelloWorld(page) {
        var scale = 1;
        var viewport = page.getViewport(scale);

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('pdfcanvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        page.render({canvasContext: context, viewport: viewport}).promise.then(function () {
          console.log('Rendered');
        });
      });
    });
  })
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
