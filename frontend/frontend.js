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
    var DEFAULT_URL = 'http://arxiv.org/pdf/1601.07596.pdf';
    var PAGE_TO_VIEW = 1;
    var SCALE = 1.0;

    var container = document.getElementById('pdfcanvas');

    // Loading document.
    PDFJS.getDocument(DEFAULT_URL).then(function (pdfDocument) {
      // Document loaded, retrieving the page.
      return pdfDocument.getPage(PAGE_TO_VIEW).then(function (pdfPage) {
        // Creating the page view with default parameters.
        var pdfPageView = new PDFJS.PDFPageView({
          container: container,
          id: PAGE_TO_VIEW,
          scale: SCALE,
          defaultViewport: pdfPage.getViewport(SCALE),
          // We can enable text/annotations layers, if needed
          //textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
          //annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
        });
        // Associates the actual page with the view, and drawing it
        pdfPageView.setPdfPage(pdfPage);
        return pdfPageView.draw();
      });
    });
    //PDFJS.getDocument(url).then(function (pdf) {
    //  // Fetch the first page
    //  pdf.getPage(1).then(function (page) {
    //    var scale = 1;
    //    var viewport = page.getViewport(scale);

    //    // Prepare canvas using PDF page dimensions
    //    var canvas = document.getElementById('pdfcanvas');
    //    var context = canvas.getContext('2d');
    //    canvas.height = viewport.height;
    //    canvas.width = viewport.width;

    //    // Render PDF page into canvas context
    //    page.render({canvasContext: context, viewport: viewport}).promise.then(function () {
    //      console.log('Rendered');
    //    });
    //  });
    //});

  })
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
