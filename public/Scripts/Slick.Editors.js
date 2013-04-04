/***
* Contains basic SlickGrid editors.
* @module Editors
* @namespace Slick
*/

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Editors": {
                "Text": TextEditor,
                "Integer": IntegerEditor,
                "Date": DateEditor,
                "YesNoSelect": YesNoSelectEditor,
                "Checkbox": CheckboxEditor,
                "PercentComplete": PercentCompleteEditor,
                "LongText": LongTextEditor,
                "Money": MoneyEditor,
                "AltSpecial": AltSpecialEditor
            }
        }
    });

    function TextEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $input = $("<INPUT type=text class='editor-text' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
              if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                  e.stopImmediatePropagation();
              }
          })
          .focus()
          .select();
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.getValue = function () {
            return $input.val();
        };

        this.setValue = function (val) {
            $input.val(val);
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field] || "";
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function () {
            return $input.val();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function IntegerEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $input = $("<INPUT type=text class='editor-text' />");

            $input.bind("keydown.nav", function (e) {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                    e.stopImmediatePropagation();
                }
            });

            $input.appendTo(args.container);
            $input.focus().select();
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function () {
            return parseInt($input.val(), 10) || 0;
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            if (isNaN($input.val())) {
                return {
                    valid: false,
                    msg: "Please enter a valid integer"
                };
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function DateEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;
        var calendarOpen = false;

        this.init = function () {
            $input = $("<INPUT type=text class='editor-text' />");
            $input.appendTo(args.container);
            $input.focus().select();
            $input.datepicker({
                showOn: "button",
                buttonImageOnly: true,
                buttonImage: "images/calendar.gif",
                beforeShow: function () {
                    calendarOpen = true
                },
                onClose: function () {
                    calendarOpen = false
                }
            });
            $input.width($input.width() - 18);
        };

        this.destroy = function () {
            $.datepicker.dpDiv.stop(true, true);
            $input.datepicker("hide");
            $input.datepicker("destroy");
            $input.remove();
        };

        this.show = function () {
            if (calendarOpen) {
                $.datepicker.dpDiv.stop(true, true).show();
            }
        };

        this.hide = function () {
            if (calendarOpen) {
                $.datepicker.dpDiv.stop(true, true).hide();
            }
        };

        this.position = function (position) {
            if (!calendarOpen) {
                return;
            }
            $.datepicker.dpDiv
          .css("top", position.top + 30)
          .css("left", position.left);
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function () {
            return $input.val();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function YesNoSelectEditor(args) {
        var $select;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
            $select.appendTo(args.container);
            $select.focus();
        };

        this.destroy = function () {
            $select.remove();
        };

        this.focus = function () {
            $select.focus();
        };

        this.loadValue = function (item) {
            $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
            $select.select();
        };

        this.serializeValue = function () {
            return ($select.val() == "yes");
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return ($select.val() != defaultValue);
        };

        this.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function CheckboxEditor(args) {
        var $select;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
            $select.appendTo(args.container);
            $select.focus();
        };

        this.destroy = function () {
            $select.remove();
        };

        this.focus = function () {
            $select.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            if (defaultValue) {
                $select.attr("checked", "checked");
            } else {
                $select.removeAttr("checked");
            }
        };

        this.serializeValue = function () {
            return $select.attr("checked");
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return ($select.attr("checked") != defaultValue);
        };

        this.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function PercentCompleteEditor(args) {
        var $input, $picker;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $input = $("<INPUT type=text class='editor-percentcomplete' />");
            $input.width($(args.container).innerWidth() - 25);
            $input.appendTo(args.container);

            $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
            $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

            $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

            $input.focus().select();

            $picker.find(".editor-percentcomplete-slider").slider({
                orientation: "vertical",
                range: "min",
                value: defaultValue,
                slide: function (event, ui) {
                    $input.val(ui.value)
                }
            });

            $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
                $input.val($(this).attr("val"));
                $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
            })
        };

        this.destroy = function () {
            $input.remove();
            $picker.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            $input.val(defaultValue = item[args.column.field]);
            $input.select();
        };

        this.serializeValue = function () {
            return parseInt($input.val(), 10) || 0;
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
        };

        this.validate = function () {
            if (isNaN(parseInt($input.val(), 10))) {
                return {
                    valid: false,
                    msg: "Please enter a valid positive number"
                };
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    /*
    * An example of a "detached" editor.
    * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
    * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
    */
    function LongTextEditor(args) {
        var $input, $wrapper;
        var defaultValue;
        var scope = this;

        this.init = function () {
            var $container = $("body");

            $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

            $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

            $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

            $wrapper.find("button:first").bind("click", this.save);
            $wrapper.find("button:last").bind("click", this.cancel);
            $input.bind("keydown", this.handleKeyDown);

            scope.position(args.position);
            $input.focus().select();
        };

        this.handleKeyDown = function (e) {
            if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
                scope.save();
            } else if (e.which == $.ui.keyCode.ESCAPE) {
                e.preventDefault();
                scope.cancel();
            } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                e.preventDefault();
                grid.navigatePrev();
            } else if (e.which == $.ui.keyCode.TAB) {
                e.preventDefault();
                grid.navigateNext();
            }
        };

        this.save = function () {
            args.commitChanges();
        };

        this.cancel = function () {
            $input.val(defaultValue);
            args.cancelChanges();
        };

        this.hide = function () {
            $wrapper.hide();
        };

        this.show = function () {
            $wrapper.show();
        };

        this.position = function (position) {
            $wrapper
          .css("top", position.top - 5)
          .css("left", position.left - 5)
        };

        this.destroy = function () {
            $wrapper.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            $input.val(defaultValue = item[args.column.field]);
            $input.select();
        };

        this.serializeValue = function () {
            return $input.val();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function MoneyEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $input = $("<INPUT type=text class='editor-text' />");

            $input.bind("keydown.nav", function (e) {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                    e.stopImmediatePropagation();
                }
            });

            $input.appendTo(args.container);
            $input.focus().select();
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function () {
            return parseFloat($input.val()).toFixed(2) || 0;
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            if (isNaN($input.val())) {
                return {
                    valid: false,
                    msg: "Please enter a valid amount."
                };
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function AltSpecialEditor(args) {
        var $input, $wrapper;
        var $inputAlterLength, defaultValueAL, $inputAlterWaist, defaultValueAW, $inputAlterBoth, defaultValueAB, $inputSpecial, defaultValueSP;
        var $inputPersonalization, defaultValueEM, $inputNeck, defaultValueNE;
        var $inputChest, defaultValueCH$inputSleeve, defaultValueSL, $inputCrotch, defaultValueCR, $inputWaist, defaultValueWA, defaultValueIS, $inputInseam;
        var $inputBackWaist, defaultValueBW$inputFinishedLength, defaultValueFL, $inputBust, defaultValueBU, $inputUnderBust, defaultValueUB, $inputHip, defaultValueHP;
        var $inputHead, defaultValueHD$inputHeight, defaultValueHT, $inputWeight, defaultValueWT, $inputNotes, defaultValueNO;

        var scope = this;
        var itemTmp = [];

        this.init = function () {
            var $container = $("body");

            $wrapper = $("<div style='z-index:10000; position:absolute; background:coral; padding:5px; border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
            .appendTo($container);
            $inputAlterLength = $("<div style='backround:white;width:240px;height:1.5em;border:0;outline:0;'><input type='radio' name='group1' id='alterlength' value='Alter Length' />Alter Length</div>")
            .appendTo($wrapper);
            $inputAlterWaist = $("<div style='backround:white;height:1.5em;border:0;outline:0; padding-top:.5em;'><input type='radio' name='group1' id='alterwaist' value='Alter Waist' />Alter Waist</div>")
            .appendTo($wrapper);
            $inputAlterBoth = $("<div style='backround:white;height:1.5em;border:0;outline:0; padding-top:.5em;'><input type='radio' name='group1' id='alterboth' value='Alter Both' />Alter Both</div>")
            .appendTo($wrapper);
            $inputSpecial = $("<div style='backround:white;height:1.5em; border:0;outline:0; padding-top:.5em;'><input type='radio' name='group1' id='special' value='Special Order' />Special Order</div>")
            .appendTo($wrapper);
            $inputPersonalization = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Personalization:<input type='text' id='personalization' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputNeck = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Neck:<input type='text' id='neck' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputChest = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Chest:<input id='chest'type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputSleeve = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Sleeve:<input id='sleeve' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputCrotch = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Crotch:<input id='crotch' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputWaist = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Waist:<input id='waist'type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputInseam = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Inseam:<input id='inseam' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputBackWaist = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Back Waist:<input id='backwaist' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputFinishedLength = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Finished Length:<input id='finishedlength' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputBust = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Bust:<input id='bust' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputUnderBust = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Under-Bust:<input id='underbust' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputHip = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Hip:<input id='hip' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputHead = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Head:<input id='head' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputHeight = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Height:<input id='height' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputWeight = $("<div class='pdInput' style='backround:white; border:0; outline:0; padding-top:1em;'>Weight:<input id='weight' type='text' style='width:110px; position:absolute; left:100px;' /></div>")
            .appendTo($wrapper);
            $inputNotes = $("<textarea id='pdinput' class='pdInput' rows=5 style='backround:white;width:250px;height:80px;border:1; outline:1; margin-top:1em;'>")
          .appendTo($wrapper);
            $("<div style='text-align:right; border:0; outline:0; margin-top:1em;'><button id='save' style='background-color:#27ba18; color:white; margin-right:2em; border:1px solid black; width:60px; -moz-border-radius:3px; border-radius:3px;'>Save</button><button id='cancel' style='border:1px solid black; width:60px; -moz-border-radius:3px; border-radius:3px;'>Cancel</button><button id='remove' style='background-color:tomato; color:white; margin-left:2em; margin-right:2em; border:1px solid black; width:60px; -moz-border-radius:3px; border-radius:3px;'>Remove</button></div>")
          .appendTo($wrapper);

            $wrapper.find("#save").bind("click", this.save);
            $wrapper.find("#cancel").bind("click", this.cancel);
            $wrapper.find("#remove").bind("click", this.remove);
            $('.pdInput').keydown(this.handleKeyDown);

            scope.position(args.position);
            //$inputAlterLength.children(0).focus(); //.select();
        };

        this.handleKeyDown = function (e) {
            if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
                scope.save();
            } else if (e.which == $.ui.keyCode.ESCAPE) {
                e.preventDefault();
                scope.cancel();
            } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                e.preventDefault();
                grid.navigatePrev();
            } else if (e.which == $.ui.keyCode.TAB) {
                e.preventDefault();
                grid.navigateNext();
            }
        };

        this.save = function () {
            itemTmp[args.column.field].AlterLength = $('#alterlength').prop('checked');
            itemTmp[args.column.field].AlterWaist = $('#alterwaist').prop('checked');
            itemTmp[args.column.field].AlterBoth = $('#alterboth').prop('checked');
            itemTmp[args.column.field].Special = $('#special').prop('checked');
            itemTmp[args.column.field].Personalization = $inputPersonalization.children(0).val();
            itemTmp[args.column.field].Neck = $inputNeck.children(0).val();
            itemTmp[args.column.field].Chest = $inputChest.children(0).val();
            itemTmp[args.column.field].Sleeve = $inputSleeve.children(0).val();
            itemTmp[args.column.field].Crotch = $inputCrotch.children(0).val();
            itemTmp[args.column.field].Waist = $inputWaist.children(0).val();
            itemTmp[args.column.field].Inseam = $inputInseam.children(0).val();
            itemTmp[args.column.field].BackWaist = $inputBackWaist.children(0).val();
            itemTmp[args.column.field].FinishedLength = $inputFinishedLength.children(0).val();
            itemTmp[args.column.field].Bust = $inputBust.children(0).val();
            itemTmp[args.column.field].UnderBust = $inputUnderBust.children(0).val();
            itemTmp[args.column.field].Hip = $inputHip.children(0).val();
            itemTmp[args.column.field].Head = $inputHead.children(0).val();
            itemTmp[args.column.field].Height = $inputHeight.children(0).val();
            itemTmp[args.column.field].Weight = $inputWeight.children(0).val();
            itemTmp[args.column.field].Notes = $inputNotes.val();
            args.commitChanges();
            grid.gotoCell(data.length, 0, false);
        };

        this.cancel = function () {
            $('#alterlength').prop('checked', defaultValueAL);
            $('#alterwaist').prop('checked', defaultValueAW);
            $('#alterboth').prop('checked', defaultValueAB);
            $('#special').prop('checked', defaultValueSP);
            $inputPersonalization.children(0).val(defaultValueEM);
            $inputNeck.children(0).val(defaultValueNE);
            $inputChest.children(0).val(defaultValueCH);
            $inputSleeve.children(0).val(defaultValueSL);
            $inputCrotch.children(0).val(defaultValueCR);
            $inputWaist.children(0).val(defaultValueWA);
            $inputInseam.children(0).val(defaultValueIS);
            $inputBackWaist.children(0).val(defaultValueBW);
            $inputFinishedLength.children(0).val(defaultValueFL);
            $inputBust.children(0).val(defaultValueBU);
            $inputUnderBust.children(0).val(defaultValueUB);
            $inputHip.children(0).val(defaultValueHP);
            $inputHead.children(0).val(defaultValueHD);
            $inputHeight.children(0).val(defaultValueHT);
            $inputWeight.children(0).val(defaultValueWT);
            $inputNotes.val(defaultValueNO);
            args.cancelChanges();
        };

        this.hide = function () {
            $wrapper.hide();
        };

        this.show = function () {
            $wrapper.show();
        };

        this.position = function (position) {
            $wrapper
          .css("top", 100)
          .css("left", 600)
        };

        this.remove = function () {
            itemTmp[args.column.field].AlterLength = false;
            itemTmp[args.column.field].AlterWaist = false;
            itemTmp[args.column.field].AlterBoth = false;
            itemTmp[args.column.field].Special = false;
            itemTmp[args.column.field].Personalization = '';
            itemTmp[args.column.field].Neck = '';
            itemTmp[args.column.field].Chest = '';
            itemTmp[args.column.field].Sleeve = '';
            itemTmp[args.column.field].Crotch = '';
            itemTmp[args.column.field].Waist = '';
            itemTmp[args.column.field].Inseam = '';
            itemTmp[args.column.field].BackWaist = '';
            itemTmp[args.column.field].FinishedLength = '';
            itemTmp[args.column.field].Bust = '';
            itemTmp[args.column.field].UnderBust = '';
            itemTmp[args.column.field].Hip = '';
            itemTmp[args.column.field].Head = '';
            itemTmp[args.column.field].Height = '';
            itemTmp[args.column.field].Weight = '';
            itemTmp[args.column.field].Notes = '';
            args.commitChanges();
            grid.gotoCell(data.length, 0, false);
        };

        this.destroy = function () {
            $wrapper.remove();
        };

        this.focus = function () {
            $inputAlterLength.children(0).focus();
        };

        this.loadValue = function (item) {
            itemTmp = item;
            $('#alterlength').prop('checked', (defaultValueAL = item[args.column.field].AlterLength));
            $('#alterwaist').prop('checked', (defaultValueAW = item[args.column.field].AlterWaist));
            $('#alterboth').prop('checked', (defaultValueAB = item[args.column.field].AlterBoth));
            $('#special').prop('checked', (defaultValueSP = item[args.column.field].Special));
            $inputPersonalization.children(0).val(defaultValueEM = item[args.column.field].Personalization);
            $inputNeck.children(0).val(defaultValueNE = item[args.column.field].Neck);
            $inputChest.children(0).val(defaultValueCH = item[args.column.field].Chest);
            $inputSleeve.children(0).val(defaultValueSL = item[args.column.field].Sleeve);
            $inputCrotch.children(0).val(defaultValueCR = item[args.column.field].Crotch);
            $inputWaist.children(0).val(defaultValueWA = item[args.column.field].Waist);
            $inputInseam.children(0).val(defaultValueIS = item[args.column.field].Inseam);
            $inputBackWaist.children(0).val(defaultValueBW = item[args.column.field].BackWaist);
            $inputFinishedLength.children(0).val(defaultValueFL = item[args.column.field].FinishedLength);
            $inputBust.children(0).val(defaultValueBU = item[args.column.field].Bust);
            $inputUnderBust.children(0).val(defaultValueUB = item[args.column.field].UnderBust);
            $inputHip.children(0).val(defaultValueHP = item[args.column.field].Hip);
            $inputHead.children(0).val(defaultValueHD = item[args.column.field].Head);
            $inputHeight.children(0).val(defaultValueHT = item[args.column.field].Height);
            $inputWeight.children(0).val(defaultValueWT = item[args.column.field].Weight);
            $inputNotes.val(defaultValueNO = item[args.column.field].Notes);

            $('#alterlength').select();
        };

        this.serializeValue = function () {
           var ret = $(this).serialize();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return false;
            var changed = false;

            changed = ($('#alterlength').prop('checked') != defaultValueAL);
            if (!changed) { changed = ($('#alterwaist').prop('checked') != defaultValueAW) };
            if (!changed) { changed = ($('#alterboth').prop('checked') != defaultValueAB) };
            if (!changed) { changed = ($('#special').prop('checked') != defaultValueSP) };
            if (!changed) { changed = (!($inputPersonalization.children(0).val() == "" && defaultValueBW == null)) && ($inputPersonalization.children(0).val() != defaultValueEM) };
            if (!changed) { changed = (!($inputBackWaist.children(0).val() == "" && defaultValueBW == null)) && ($inputBackWaist.children(0).val() != defaultValueBW) };
            if (!changed) { changed = (!($inputBust.children(0).val() == "" && defaultValueBU == null)) && ($inputBust.children(0).val() != defaultValueBU) };
            if (!changed) { changed = (!($inputChest.children(0).val() == "" && defaultValueCH == null)) && ($inputChest.children(0).val() != defaultValueCH) };
            if (!changed) { changed = (!($inputCrotch.children(0).val() == "" && defaultValueCR == null)) && ($inputCrotch.children(0).val() != defaultValueCR) };

            if (!changed) { changed = (!($inputFinishedLength.children(0).val() == "" && defaultValueFL == null)) && ($inputFinishedLength.children(0).val() != defaultValueFL) };
            if (!changed) { changed = (!($inputHead.children(0).val() == "" && defaultValueHD == null)) && ($inputHead.children(0).val() != defaultValueHD) };
            if (!changed) { changed = (!($inputHeight.children(0).val() == "" && defaultValueHT == null)) && ($inputHeight.children(0).val() != defaultValueHT) };
            if (!changed) { changed = (!($inputHip.children(0).val() == "" && defaultValueHP == null)) && ($inputHip.children(0).val() != defaultValueHP) };
            if (!changed) { changed = (!($inputInseam.children(0).val() == "" && defaultValueIS == null)) && ($inputInseam.children(0).val() != defaultValueIS) };
            if (!changed) { changed = (!($inputNeck.children(0).val() == "" && defaultValueNE == null)) && ($inputNeck.children(0).val() != defaultValueNE) };

            if (!changed) { changed = (!($inputNotes.children(0).val() == "" && defaultValueNO == null)) && ($inputNotes.children(0).val() != defaultValueNO) };
            if (!changed) { changed = (!($inputSleeve.children(0).val() == "" && defaultValueSL == null)) && ($inputSleeve.children(0).val() != defaultValueSL) };
            if (!changed) { changed = (!($inputSpecial.children(0).val() == "" && defaultValueSP == null)) && ($inputSpecial.children(0).val() != defaultValueSP) };
            if (!changed) { changed = (!($inputUnderBust.children(0).val() == "" && defaultValueUB == null)) && ($inputUnderBust.children(0).val() != defaultValueUB) };
            if (!changed) { changed = (!($inputWaist.children(0).val() == "" && defaultValueWA == null)) && ($inputWaist.children(0).val() != defaultValueWA) };
            if (!changed) { changed = (!($inputWeight.children(0).val() == "" && defaultValueWT == null)) && ($inputWeight.children(0).val() != defaultValueWT) };

            if (!changed) { changed = (!($inputNotes.val() == "" && defaultValueNO == null)) && ($inputNotes.val() != defaultValueNO) };
            alert(changed);
            return changed;
        };

        this.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }
})(jQuery);
