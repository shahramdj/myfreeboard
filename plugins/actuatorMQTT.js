// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ freeboard-actuatorMQTT-plugin                                      │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ http://blog.onlinux.fr/actuator-plugin-for-freeboard-io/           │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Freeboard widget plugin.                                           │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
(function () {
    //
    // DECLARATIONS
    //
    var LOADING_INDICATOR_DELAY = 1000;
    //

    freeboard.loadWidgetPlugin({
        type_name: "actuatorMQTT",
        display_name: "ActuatorMQTT",
        description: "Actuator which can send a MQTT message to AWS Amazon or CloudMQTT datasource. The MQTT message is in JSON format and includes the epoch timestamp and the value.",
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "sourceid",
                display_name: "source",
                type: "calculated"
            },
            {
                name: "topic",
                display_name: "send topic",
                type: "text"
            }

        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new actuatorMQTT(settings));
        }
    });

    freeboard.addStyle('.indicator-light.interactive:hover', "box-shadow: 0px 0px 15px #FF9900; cursor: pointer;");


    var actuatorMQTT = function (settings) {
        var self = this;
        var textBox = $ ('<input id="textBox" color= "#FF9900" class="text">');
        var button = $ ('<button id="button_1" style="margin-left:5px;">Send</button></div>');
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<h2 class="indicator-text"></h2>');
        var indicatorElement = $('<div class="indicator-light interactive"></div>');
        var currentSettings = settings;
        var isOn = false;
        var onText;
        var offText;
        var url;

        function updateState() {
            indicatorElement.toggleClass("on", isOn);

        }


        this.onClick = function(e) {
            e.preventDefault()
            // Allow for widgets to send data back to sources
            // this.sendValue(currentSettings.sourceid,currentSettings.topic,document.getElementsByClassName('text')[counter].value);
            var message = new Object();
            message.timestamp = new Date().getTime()/1000;
            message.payload  = $(textBox).val();
            var messageString= JSON.stringify(message);
            this.sendValue(currentSettings.sourceid,currentSettings.topic,messageString);
            $(textBox).val('');
        }      


        this.render = function (element) {
            $(element).append(titleElement).append(stateElement).append(textBox).append(button);
            $(button).click(this.onClick.bind(this));
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "sourceid") {
                isOn = Boolean(newValue);
            }
            if (settingName == "on_text") {
                onText = newValue;
            }
            if (settingName == "off_text") {
                offText = newValue;
            }
            updateState();
        }

        var request;


        this.alertContents = function () {

        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 1;
        }

        this.onSettingsChanged(settings);
    };

}());