/* vim: set expandtab tabstop=4 shiftwidth=4: */

/**
 * Copyright (c) 2011 KUBO Atsuhiro <kubo@iteman.jp>,
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @package    PieceMakegoodBundle
 * @copyright  2011 KUBO Atsuhiro <kubo@iteman.jp>
 * @license    http://www.opensource.org/licenses/bsd-license.php  New BSD License
 * @version    Release: @package_version@
 * @since      File available since Release 0.1.0
 */

Module("Piece", function () {
    Module("MakeGood", function () {
        Module("UI", function () {
            Module("Widget", function () {
                Class("ProgressBar", {
                    my: {
                        has: {
                            SELECTOR_CONTAINER: "#piecemakegood-progressbar",
                            SELECTOR_LABEL: ".piecemakegood-progressbar-label",
                            SELECTOR_VALUE: ".ui-progressbar-value",
                            ICON_PASSED: "progressbar_passed.png",
                            ICON_FAILED: "progressbar_failed.png",
                            ICON_STOPPED: "progressbar_stopped.png"
                        }
                    },

                    has: {
                        configuration: {}
                    },

                    after: {
                        initialize: function (props) {
                            this.configuration = props.configuration;
                            var self = this;
                            jQuery(this.my.SELECTOR_CONTAINER).progressbar({
                                change: function (event, ui) {
                                    var newValue = jQuery(this).progressbar("option", "value");
                                    jQuery(self.my.SELECTOR_LABEL, this).text(newValue + "%");
                                }
                            });
                            this.clear();
                        }
                    },

                    methods: {
                        update: function (rate) {
                            jQuery(this.my.SELECTOR_CONTAINER).progressbar("option", "value", rate);
                        },

                        markAsFailed: function () {
                            this.changeColor(this.my.ICON_FAILED);
                        },

                        markAsStopped: function () {
                        },

                        clear: function () {
                            this.changeColor(this.my.ICON_PASSED);
                            this.update(0);
                        },

                        changeColor: function (icon) {
                            jQuery(this.my.SELECTOR_VALUE).css("background-image", "url(" + this.configuration.getAssetBaseURI() + "/images/" + icon + ")");
                        }
                    }
                })
            })
        })
    })
});

/*
 * Local Variables:
 * mode: js
 * coding: iso-8859-1
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * indent-tabs-mode: nil
 * End:
 */
