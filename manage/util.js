window.Util = {
    generateTabelHTML: function (currentContentId, data, commands, customColumnFunc, customButtonFunc) {
        var orderedColumns = [];
        $("#" + currentContentId + " table tr th[data-column-id]").each(function () {
            orderedColumns.push($(this).attr("data-column-id"));
        });
        var contentTemp = '';
        data.forEach(function (item) {
            var tr = '<tr>'
            orderedColumns.forEach(function (column) {
                var value = item.hasOwnProperty(column) ? item[column] : "";
                if (!customColumnFunc) {
                    tr += '<td>' + value + '</td>'
                }
                else {
                    tr += customColumnFunc(column, value, item);
                }
            });
            tr += "<td>";
            if (commands) {
                for (var i = 0; i < commands.length; i++) {
                    tr += commands[i];
                }
            }
            tr += "</td>";
            tr += '</tr>';

            if (customButtonFunc) {
                tr = customButtonFunc(tr, item);
            }

            contentTemp += tr;
        });

        $('#' + currentContentId + ' table tbody').html('');
        $('#' + currentContentId + ' table tbody').html(contentTemp);
    },
    getCurrentTrColumnValue: function (currentTrEl, columnName) {
        var parentEl = currentTrEl.parentNode;
        var returnColumnValue = '';
        while (parentEl != null && parentEl.tagName != "TABLE") {
            parentEl = parentEl.parentNode;
        }
        if (parentEl.tagName == "TABLE") {
            var columnIndex = -1;
            $(parentEl).find("th").toArray().find(function (item, index) {
                if ($(item).attr("data-column-id").toLowerCase() == columnName.toLowerCase()) {
                    columnIndex = index;
                    return true;
                }
                return false;
            });
            if (columnIndex > -1) {
                returnColumnValue = $(currentTrEl).find("td")[columnIndex].innerHTML;
            }
        }
        return returnColumnValue;
    },
    truncateText: function (text, length) {
        length = length || 30;
        return text.length > length ? text.substring(0, length) + "..." : text;
    },
    checkAuth: function () {
        Util.doFetch(Config.serviceBasicUrl + 'api/auth/health')
            .catch(err => window.location.href = 'login.html');
    },
    doFetch(url, options = {}) {
        let handleErrors = function (response) {
            if (!response.ok) {
                // throw Error(response.statusText);
                throw response
            }
            return response;
        }
        if (options.headers) {
            options.headers.Authorization = window.localStorage.getItem('authorization');
        }
        else {
            options.headers = {
                'Authorization': window.localStorage.getItem('authorization')
            };
        }
        $('#loading').show();
        return new Promise((resolvd, reject) => {
            fetch(url, options)
                .then(response => {
                    $('#loading').hide();
                    if (!response.ok) { throw response }
                    return response.json();  //we only get here if there is no error
                })
                .then(resolvd)
                .catch(err => {
                    $('#loading').hide();
                    if (err.status === 401 || err.status === 500) {
                        reject(err);
                    }
                    err.json().then(reject);
                });
        })
    }
}