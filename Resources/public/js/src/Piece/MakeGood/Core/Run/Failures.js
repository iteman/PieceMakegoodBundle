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
                Class("Failures", {
                    my: {
                        has: {
                            FIND_PREVIOUS: { init: 1 },
                            FIND_NEXT: { init: 2 },
                        }
                    },

                    has: {
                        orderedResults: { init: Joose.I.Array },
                        resultIndexes: { init: Joose.I.Array },
                        failureIndexes: { init: Joose.I.Array },
                    },

                    methods: {
                        addResult: function(result) {
                            this.orderedResults.push(result);
                            this.resultIndexes[ result.getId() ] = this.orderedResults.length - 1;
                        },

                        markCurrentResultAsFailure: function() {
                            this.failureIndexes.push(this.orderedResults.length - 1);
                        },

                        find: function(criterion, direction) {
                            var indexOfCriterion = this.resultIndexes[ criterion.getId() ];
                            if (indexOfCriterion == null) return null;

                            if (criterion instanceof Piece.MakeGood.Core.Result.TestSuiteResult) {
                                indexOfCriterion += criterion.getSize();
                            }

                            if (direction == this.my.FIND_NEXT) {
                                for (var i = this.failureIndexes.length - 1; i >=0; --i) {
                                    var indexOfFailure = this.failureIndexes[i];
                                    if (indexOfFailure >= indexOfCriterion) continue;
                                    return this.orderedResults[indexOfFailure];
                                }
                                if (this.failureIndexes.length > 0) {
                                    return this.orderedResults[ this.failureIndexes[ failureIndexes.length - 1 ] ];
                                }
                            } else if (direction == this.my.FIND_PREVIOUS) {
                                for (var i = 0; i < this.failureIndexes.length; ++i) {
                                    var indexOfFailure = this.failureIndexes[i];
                                    if (indexOfFailure <= indexOfCriterion) continue;
                                    return this.orderedResults[indexOfFailure];
                                }
                                if (this.failureIndexes.length > 0) {
                                    return this.orderedResults[ this.failureIndexes[0] ];
                                }
                            }

                            return null;
                        },

                        onFirstTestSuite: function(testSuite) {
                        },

                        startTestSuite: function(testSuite) {
                            this.addResult(testSuite);
                        },

                        endTestSuite: function(testSuite) {
                        },

                        startTestCase: function(testCase) {
                            this.addResult(testCase);
                        },

                        endTestCase: function(testCase) {
                        },

                        startFailure: function(failure) {
                            this.markCurrentResultAsFailure();
                        },

                        endFailure: function(failure) {
                        },

                        startTest: function() {
                        },

                        endTest: function() {
                        },

                        startError: function(error) {
                            this.markCurrentResultAsFailure();
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
