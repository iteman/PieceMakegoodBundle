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
                Class("Counters", {
                    my: {
                        has: {
                            SELECTOR_TEST_LABEL: "#piecemakegood-counter-test-label",
                            SELECTOR_TEST_VALUE_CURRENT: "#piecemakegood-counter-test-value-current",
                            SELECTOR_TEST_VALUE_ALL: "#piecemakegood-counter-test-value-all",
                            SELECTOR_PASS_LABEL: "#piecemakegood-counter-pass-label",
                            SELECTOR_PASS_VALUE: "#piecemakegood-counter-pass-value",
                            SELECTOR_FAILURE_LABEL: "#piecemakegood-counter-failure-label",
                            SELECTOR_FAILURE_VALUE: "#piecemakegood-counter-failure-value",
                            SELECTOR_ERROR_LABEL: "#piecemakegood-counter-error-label",
                            SELECTOR_ERROR_VALUE: "#piecemakegood-counter-error-value"
                        }
                    },

                    has: {
                    },

                    after: {
                        initialize: function (props) {
                            this.initializeLabels();
                            this.clear();
                        }
                    },

                    methods: {
                        initializeLabels: function () {
                            jQuery(this.my.SELECTOR_TEST_LABEL).text("Tests" + ":");
                            jQuery(this.my.SELECTOR_PASS_LABEL).text("Passes" + ":");
                            jQuery(this.my.SELECTOR_FAILURE_LABEL).text("Failures" + ":");
                            jQuery(this.my.SELECTOR_ERROR_LABEL).text("Errors" + ":");
                        },

                        clear: function () {
                            this.updateCurrentTestCount(0);
                            this.updateAllTestCount(0);
                            this.updatePassCount(0);
                            this.updateFailureCount(0);
                            this.updateErrorCount(0);
                        },

                        updateCurrentTestCount: function (count) {
                            jQuery(this.my.SELECTOR_TEST_VALUE_CURRENT).text(count);
                        },

                        updateAllTestCount: function (count) {
                            jQuery(this.my.SELECTOR_TEST_VALUE_ALL).text(count);
                        },

                        updatePassCount: function (count) {
                            jQuery(this.my.SELECTOR_PASS_VALUE).text(count);
                        },

                        updateFailureCount: function (count) {
                            jQuery(this.my.SELECTOR_FAILURE_VALUE).text(count);
                        },

                        updateErrorCount: function (count) {
                            jQuery(this.my.SELECTOR_ERROR_VALUE).text(count);
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
