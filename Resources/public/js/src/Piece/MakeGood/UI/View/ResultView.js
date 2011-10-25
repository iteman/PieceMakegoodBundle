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
            Module("View", function () {
                Class("ResultView", {
                    has: {
                        controller: {},
                        configuration: {},
                        progressBar: {},
                        testLifecycle: {},
                        counters: {}
                    },

                    after: {
                        initialize: function (props) {
                            this.controller = props.controller;
                            this.configuration = props.configuration;
                            this.initializeActions();
                            this.initializeWidgets();
                        }
                    },

                    methods: {
                        clear: function () {
                            this.progressBar.clear();
                            this.counters.clear();
                        },

                        updateOnEndTestCase: function () {
                            if (this.testLifecycle.getProgress().hasFailures()) {
                                this.markAsFailed();
                            }
                            this.updateResult();
                        },

                        updateOnStartTestCase: function () {
                            this.updateCurrentTestCount();
                        },

                        startTest: function (testLifecycle) {
                            this.clear();
                            this.testLifecycle = testLifecycle;
                        },

                        markAsFailed: function () {
                            this.progressBar.markAsFailed();
                        },

                        initializeActions: function () {
                            var self = this;
                            jQuery("#piecemakegood-action-runalltests").click(function () { self.controller.runTest(); });
                        },

                        initializeWidgets: function () {
                            jQuery("#piecemakegood-action-runalltests").button({
                                icons: { primary: 'piecemakegood-action-runalltests' },
                                label: "Run All Tests"
                            });
                            this.progressBar = new Piece.MakeGood.UI.Widget.ProgressBar({
                                configuration: this.configuration
                            });
                            this.counters = new Piece.MakeGood.UI.Widget.Counters();
                        },

                        updateResult: function () {
                            this.progressBar.update(this.testLifecycle.getProgress().calculateRate());
                            this.counters.updatePassCount(this.testLifecycle.getProgress().getPassCount());
                            this.counters.updateFailureCount(this.testLifecycle.getProgress().getFailureCount());
                            this.counters.updateErrorCount(this.testLifecycle.getProgress().getErrorCount());
                        },

                        updateCurrentTestCount: function () {
                            this.counters.updateCurrentTestCount(
                                this.testLifecycle.getProgress().isRunning()
                                    ? this.testLifecycle.getProgress().getTestCount() + 1
                                    : this.testLifecycle.getProgress().getTestCount()
                            );
                        },

                        notify: function (message) {
                            jQuery("#piecemakegood-notification").text(message);
                        },

                        updateOnFirstTestSuite: function () {
                            this.counters.updateAllTestCount(this.testLifecycle.getProgress().getAllTestCount());
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
