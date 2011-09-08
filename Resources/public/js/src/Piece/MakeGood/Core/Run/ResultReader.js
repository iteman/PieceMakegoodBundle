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
                Class("ResultReader", {
                    has: {
                        result: { is: "ro" },
                        currentTestSuite: {},
                        currentTestCase: {},
                        listeners: { init: Joose.I.Array },
                        stopped: { is: "ro", init: false, getterName: "isStopped" }
                    },

                    methods: {
                        read: function (resultFragment) {
                            // var resultFragment = JSON.parse(resultAsJSON);
                            if (!resultFragment || (resultFragment.constructor !== Array && resultFragment.constructor !== Object)) {
                                throw new Error("The JSON data is invalid. An Array is expected.");
                            }

                            for (var key in resultFragment) {
                                if (key == "testsuites") {
                                    this.startTest();
                                } else if (key == "/testsuites") {
                                    this.endTest();
                                } else if (key == "testsuite") {
                                    this.startTestSuite(this.createTestSuite(resultFragment[key]));
                                } else if (key == "/testsuite") {
                                    this.endTestSuite();
                                } else if (key == "testcase") {
                                    this.startTestCase(this.createTestCase(resultFragment[key]));
                                } else if (key == "/testcase") {
                                    this.endTestCase();
                                } else if (key == "failure") {
                                    this.startFailure(this.createFailureTestCase(resultFragment[key]));
                                } else if (key == "/failure") {
                                    this.endFailure();
                                } else if (key == "error") {
                                    this.startError(this.createErrorTestCase(resultFragment[key]));
                                } else if (key == "/error") {
                                    this.endError();
                                } else {
                                    throw new Error("The element type [ " + key + " ] is invalid. One of testsuites, testsuite, testcase, failure, error is expected.");
                                }
                            }                     
                        },

                        createTestSuite: function (attributes) {
                            var testSuite = new Piece.MakeGood.Core.Result.TestSuiteResult({ name: attributes["name"] });
                            if ("file" in attributes) {
                                testSuite.setFile(attributes["file"]);
                            }
                            if ("fullPackage" in attributes) {
                                testSuite.setFullPackageName(attributes["fullPackage"]);
                            }
                            if ("package" in attributes) {
                                testSuite.setPackageName(attributes["package"]);
                            }

                            if (this.result == null) {
                                testSuite.setAllTestCount(attributes["tests"]);
                            }

                            return testSuite;
                        },

                        createTestCase: function (attributes) {
                            var testCase = new Piece.MakeGood.Core.Result.TestCaseResult({ name: attributes["name"] });
                            if ("file" in attributes) {
                                testCase.setFile(attributes["file"]);
                            }
                            if ("class" in attributes) {
                                testCase.setClassName(attributes["class"]);
                            }
                            if ("line" in attributes) {
                                testCase.setLine(attributes["line"]);
                            }

                            return testCase;
                        },

                        createFailureTestCase: function (attributes) {
                            return this.createFailureOrErrorTestCase(attributes, Piece.MakeGood.Core.Result.ResultType.my.FAILURE);
                        },

                        createErrorTestCase: function (attributes) {
                            return this.createFailureOrErrorTestCase(attributes, Piece.MakeGood.Core.Result.ResultType.my.ERROR);
                        },

                        createFailureOrErrorTestCase: function (attributes, resultType) {
                            var testCase;
                            if (this.currentTestCase == null) {
                                testCase = new Piece.MakeGood.Core.Result.TestCaseResult({ name: "(" + resultType + ")" });
                                testCase.setClassName(this.currentTestSuite.getName());
                                testCase.setFile(this.currentTestSuite.getFile());
                                testCase.markAsArtificial();
                                this.startTestCase(testCase);
                            } else {
                                testCase = this.currentTestCase;
                            }
                            testCase.setResultType(resultType);

                            if ("type" in attributes) {
                                testCase.setFailureType(attributes["type"]);
                            }
                            if ("file" in attributes) {
                                testCase.setFile(attributes["file"]);
                            }
                            if ("line" in attributes) {
                                testCase.setLine(attributes["line"]);
                            }
                            if ("message" in attributes) {
                                testCase.setFailureMessage(attributes["message"]);
                            }
                            if ("trace" in attributes) {
                                testCase.setFailureTrace(attributes["trace"]);
                            }

                            return testCase;
                        },

                        startTest: function () {
                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].startTest();
                            }
                        },

                        endTest: function () {
                            this.stopped = true;

                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].endTest();
                            }
                        },

                        startTestSuite: function (testSuite) {
                            if (this.result == null) {
                                this.result = testSuite;
                                for (i = 0; i < this.listeners.length; ++i) {
                                    this.listeners[i].onFirstTestSuite(testSuite);
                                }
                            } else {
                                this.currentTestSuite.addChild(testSuite);
                            }

                            this.currentTestSuite = testSuite;

                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].startTestSuite(this.currentTestSuite);
                            }
                        },

                        endTestSuite: function () {
                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].endTestSuite(this.currentTestSuite);
                            }

                            this.currentTestSuite = this.currentTestSuite.getParent();
                        },
                        
                        startTestCase: function (testCase) {
                            if (this.currentTestSuite != null) {
                                this.currentTestSuite.addChild(testCase);
                            }

                            this.currentTestCase = testCase;

                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].startTestCase(this.currentTestCase);
                            }
                        },

                        endTestCase: function () {
                            this.currentTestCase.fix();

                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].endTestCase(this.currentTestCase);
                            }

                            this.currentTestCase = null;
                        },

                        startFailure: function (failure) {
                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].startFailure(failure);
                            }
                        },

                        endFailure: function () {
                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].endFailure(this.currentTestCase);
                            }

                            if (this.currentTestCase.isArtificial()) {
                                this.endTestCase();
                            }
                        },

                        startError: function (error) {
                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].startError(error);
                            }
                        },

                        endError: function () {
                            for (i = 0; i < this.listeners.length; ++i) {
                                this.listeners[i].endError(this.currentTestCase);
                            }

                            if (this.currentTestCase.isArtificial()) {
                                this.endTestCase();
                            }
                        },

                        addListener: function (listener) {
                            this.listeners.push(listener);
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
