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
        Module("Core", function () {
            Module("Run", function () {
                Class("Progress", {
                    has: {
                        processTime: { is: "ro" },
                        startTimeForTestCase: {},
                        testSuite: { init: new Piece.MakeGood.Core.Result.TestSuiteResult({ name: null }) },
                        startTime: {},
                        endTime: {},
                        running: { is: "ro", init: false, getterName: "isRunning" },
                        completed: { init: false }
                    },

                    methods: {
                        getAllTestCount: function () {
                            return this.testSuite.getAllTestCount();
                        },

                        getTestCount: function () {
                            return this.testSuite.getTestCount();
                        },

                        getPassCount: function () {
                            return this.testSuite.getPassCount();
                        },

                        getFailureCount: function () {
                            return this.testSuite.getFailureCount();
                        },

                        getErrorCount: function () {
                            return this.testSuite.getErrorCount();
                        },

                        calculateRate: function () {
                            if (this.getAllTestCount() == 0) {
                                return 0;
                            }

                            var rate = Math.floor((this.getTestCount() / this.getAllTestCount()) * 100);
                            return rate <= 100 ? rate : 100;
                        },

                        calculateProcessTimeAverage: function() {
                            if (this.getTestCount() == 0) {
                                return 0;
                            }

                            return this.getProcessTime() / this.getTestCount();
                        },

                        startTestCase: function (testCase) {
                            this.startTimeForTestCase = Joose.I.Now().getMilliseconds();
                        },

                        endTestCase: function(testCase) {
                            var processTimeForTestCase = Joose.I.Now().getMilliseconds() - this.startTimeForTestCase;
                            this.processTime += processTimeForTestCase;
                            testCase.setTime(processTimeForTestCase);
                        },

                        hasFailures: function() {
                            return this.testSuite.hasFailures() || this.testSuite.hasErrors();
                        },

                        start: function() {
                            this.running = true;
                            this.startTime = Joose.I.Now().getMilliseconds();
                        },

                        end: function() {
                            this.endTime = Joose.I.Now().getMilliseconds();
                            this.running = false;
                        },

                        getElapsedTime: function() {
                            if (this.running) {
                                return Joose.I.Now().getMilliseconds() - this.startTime;
                            } else {
                                return this.endTime - this.startTime;
                            }
                        },

                        markAsCompleted: function() {
                            this.completed = true;
                        },

                        noTestsFound: function() {
                            return this.completed && this.getAllTestCount() == 0;
                        },

                        onFirstTestSuite: function(testSuite) {
                            this.testSuite = testSuite;
                            this.processTime = 0;
                        },

                        startTestSuite: function(testSuite) {
                        },

                        endTestSuite: function(testSuite) {
                        },

                        startFailure: function(failure) {
                        },

                        endFailure: function(failure) {
                        },

                        startTest: function() {
                        },

                        endTest: function() {
                            this.markAsCompleted();
                        },

                        startError: function(error) {
                        },

                        endError: function(error) {
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
