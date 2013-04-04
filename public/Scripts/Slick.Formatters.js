/***
* Contains basic SlickGrid formatters.
* @module Formatters
* @namespace Slick
*/

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Formatters": {
                "PercentComplete": PercentCompleteFormatter,
                "PercentCompleteBar": PercentCompleteBarFormatter,
                "YesNo": YesNoFormatter,
                "Checkmark": CheckmarkFormatter,
                "Negative": NegRowFormatter,
                "AltSpecial": AltSpecialFormatter
            }
        }
    });

    function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
            return "-";
        } else if (value < 50) {
            return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
        } else {
            return "<span style='color:green'>" + value + "%</span>";
        }
    }

    function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
        if (value == null || value === "") {
            return "";
        }

        var color;

        if (value < 30) {
            color = "red";
        } else if (value < 70) {
            color = "silver";
        } else {
            color = "green";
        }

        return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
    }

    function YesNoFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "Yes" : "No";
    }

    function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
        if (value == true || value == 'checked') {
            return "<img src='/Images/tick.png'>";
        } else {
            return "";
        }
        //return value ? "<img src='images/tick.png'>" : "";
    }

    // changes font color on negative
    function NegRowFormatter(row, cell, value, columnDef, dataContext) {
        if (value < 0 && dataContext.extended < 0) {

            var hilights = {};
            hilights[row] = {};
            hilights[row]["barcode"] = "hilite";
            hilights[row]["description"] = "hilite";
            hilights[row]["quantity"] = "hilite";
            hilights[row]["price"] = "hilite";
            hilights[row]["extended"] = "hilite";
            hilights[row]["taxable"] = "hilite";
            hilights[row]["ship"] = "hilite";
            hilights[row]["pickup"] = "hilite";
            hilights[row]["altspecial"] = "hilite";
            hilights[row]["school"] = "hilite";

            setTimeout(function () {
                //grid.setCellCssStyles("hilite", hilights);
            }, 100);
            return "<div class='hilite'>" + value + "</div>";
        } else {
            return value;
        }
    }

    function AltSpecialFormatter(row, cell, value, columnDef, dataContext) {
        var ret = "";

        if (value.AlterLength == 'checked' || value.AlterLength == true) {
            ret = "Alt Length";
        } else if (value.AlterWaist == 'checked' || value.AlterWaist == true) {
            ret = "Alt Waist";
        } else if (value.AlterBoth == 'checked' || value.AlterBoth == true) {
            ret = "Alt Both";
        } else if (value.Special == 'checked' || value.Special == true) {
            ret = "Special"
        } else if (value.Notes != '') {
            ret = "Comment"
        }
        return ret;
    }
})(jQuery);