define(['RootBindings', 'Knockout', 'Sugar'], function (RootBindings, ko) {

    var initialRun = true;

    function setPageTitle() {
        var title = Page.page().data.title;
        document.title = title ? (Object.isFunction(title) ? title() : title) : (Page.title ? (Object.isFunction(Page.title) ? Page.title() : Page.title) : '');
    }

    var Page = {
        init: function (name, data, callback) {
            name = name.toLowerCase();
            if ((Page.page().name == name) && (Page.page().data == data)) { // if the requested page is the same page, immediately callback
                setPageTitle();
                if (callback) {
                    callback(data);
                }
                return data;
            }
            Page.page().data.dispose(Page); // if the requested page is not the same page, dispose current page first before swap to the new page
            var initialized = data.init(Page); // init view model before template is swapped-in
            if (initialized === false) {
                return false; // stop initialization if page's init function return false
            }
            Page.bodyClass([name.dasherize(), ('ontouchstart' in document.documentElement) ? 'touch' : 'no-touch'].join(' '));
            Page.page({
                name: name,
                data: data
            }); // to test if template finished rendering, use afterRender binding
            setPageTitle();
            if (initialRun) {
                ko.applyBindings(Page, document.getElementsByTagName('html')[0]);
                initialRun = false;
            }
            if (callback && (initialized !== false)) {
                callback(data);
            }
            return data;
        },
        page: ko.observable({
            name: '',
            data: {
                init: function () {},
                dispose: function () {}
            }
        }),
        bodyClass: ko.observable(''),
        title: function () {
            return Page.page().name.titleize(); // override in RootBindings as needed
        }
    };

    Object.merge(Page, RootBindings); // additional root bindings as needed by the app

    return Page;

});
