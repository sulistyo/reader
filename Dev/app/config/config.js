CONF = {
    files: [
        'app/templates/footer.html',
        'app/templates/header.html',
        'app/templates/header1.html',
        'app/templates/title.html',
        'app/templates/NewsPage.html',
        'app/templates/NewsDetailPage.html',
        'app/core/router.js',
        'app/controllers/base.js',
        'app/controllers/news_page.js',
        'app/controllers/news_detail_page.js',
        'app/controllers/popup.js'
    ]
};

if (typeof(module) !== 'undefined') {
    module.exports = exports = CONF;
}

navigator.app = {
    loadUrl: function(url) {
        location.href = url;
    }
};

