var localSettings = (function() {
    function _getSettingsCategories() {
        var storage = window.localStorage;
        if (!storage.getItem("__categories__")) {
            storage.setItem("__categories__", JSON.stringify([]));
        }
        return JSON.parse(storage.getItem("__categories__"));
    }

    function _setSettingsCategories(categories) {
        var storage = window.localStorage;
        storage.setItem("__categories__", JSON.stringify(categories));
    }

    function _deleteSettingsCategory(category) {
        var storage = window.localStorage;

        console.log("removing category " + category);
        var keys = _getCategoryKeys(category);
        for (let i = 0; i < keys.length; ++i) {
            console.log("removing setting " + category + "/" + keys[i]);
            storage.removeItem(category + "/" + keys[i]);
        }

        var categories = _getSettingsCategories();
        var location = categories.findIndex(function(elt) { return elt == category; });
        if (location != -1) {
            categories.splice(location, 1);
            _setSettingsCategories(categories);
            populateCategorySelect();
        }
    }

    function _ensureSettingsCategory(category) {
        var categories = _getSettingsCategories();
        if (-1 == categories.findIndex(function(elt) { return elt == category; })) {
            categories.unshift(category);
            _setSettingsCategories(categories);
            // Can't get storage events on the same page that triggered them.
            // According to https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
            populateCategorySelect();
        }
    }

    function _setSettingsItem(category, key, value) {
        _ensureSettingsCategory(category);
        var storage = window.localStorage;
        storage.setItem(category + "/" + key, value);
    }

    function _getSettingsItem(category, key) {
        var storage = window.localStorage;
        return storage.getItem(category + "/" + key);
    }

    function _getCategoryKeys(category) {
        var storage = window.localStorage;
        var result = [];
        if (!category) {
            return result;
        }
        for (let i = 0; i < storage.length; ++i) {
            if (storage.key(i).startsWith(category)) {
                // Split the key at the first "/" and add the second part to the result list.
                result.push(storage.key(i).split("/", 2)[1])
            }
        }
        return result;
    }

    return {
        getSettingsCategories: function() { return _getSettingsCategories(); },
        deleteSettingsCategory: function(category) { return _deleteSettingsCategory(category); },
        setSettingsItem: function(category, key, value) { return _setSettingsItem(category, key, value); },
        getSettingsItem: function(category, key) { return _getSettingsItem(category, key); },
        getCategoryKeys: function(category) { return _getCategoryKeys(category); }
    }
})();
