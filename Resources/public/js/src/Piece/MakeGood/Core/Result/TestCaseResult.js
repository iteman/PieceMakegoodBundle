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
            Module("Result", function () {
                Class("TestCaseResult", {
                    isa: Piece.MakeGood.Core.Result.Result,

                    has: {
                        className: { is: "rw" },
                        line: { is: "rw", init: 1 },
                        artificial: { is: "ro", init: false, getterName: "isArtificial" },
                        failureType: { is: "rw" },
                        failureTrace: { is: "rw" },
                        fixed: { is: "ro", init: false, getterName: "isFixed" },
                        resultType: { is: "rw", init: Piece.MakeGood.Core.Result.ResultType.my.PASS },
                        failureMessage: { is: "rw" }
                    },

                    methods: {
                        hasErrors: function () {
                            return this.resultType == Piece.MakeGood.Core.Result.ResultType.my.ERROR;
                        },

                        hasFailures: function () {
                            return this.resultType == Piece.MakeGood.Core.Result.ResultType.my.FAILURE;
                        },

                        getChildren: function () {
                            return [];
                        },

                        setTime: function (time) {
                            this.SUPER(time);
                            this.getParent().setTime(time);
                        },

                        markAsArtificial: function () {
                            this.artificial = true;
                        },

                        getTestCount: function () {
                            if (!this.fixed) return 0;
                            return 1;
                        },

                        getErrorCount: function () {
                            if (!this.fixed) return 0;
                            return this.hasErrors() ? 1: 0;
                        },

                        getFailureCount: function () {
                            if (!this.fixed) return 0;
                            return this.hasFailures() ? 1 : 0;
                        },

                        hasChildren: function () {
                            return false;
                        },

                        getSize: function () {
                            return 1;
                        },

                        fix: function () {
                            this.fixed = true;
                        },

                        getFile: function () {
                            if (this.SUPER() == null) {
                                return this.getParent().getFile();
                            } else {
                                return this.SUPER();
                            }
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