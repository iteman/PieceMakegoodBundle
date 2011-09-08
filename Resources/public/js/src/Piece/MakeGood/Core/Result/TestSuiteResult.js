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
                Class("TestSuiteResult", {
                    isa: Piece.MakeGood.Core.Result.Result,

                    has: {
                        fullPackageName: { is: "rw" },
                        packageName: { is: "rw" },
                        children: { is: "ro", init: Joose.I.Array },
                        allTestCount: { is: "rw" }
                    },

                    methods: {
                        getTestCount: function () {
                            var count = 0;
                            for (var i = 0; i < this.children.length; ++i) {
                                count += this.children[i].getTestCount();
                            }

                            return count;
                        },

                        getErrorCount: function () {
                            var count = 0;
                            for (var i = 0; i < this.children.length; ++i) {
                                count += this.children[i].getErrorCount();
                            }

                            return count;
                        },

                        getFailureCount: function () {
                            var count = 0;
                            for (var i = 0; i < this.children.length; ++i) {
                                count += this.children[i].getFailureCount();
                            }

                            return count;
                        },

                        addChild: function (result) {
                            if (result == null) {
                                return;
                            }

                            result.setParent(this);
                            this.children.push(result);
                        },

                        getChildren: function (result) {
                            return this.children;
                        },

                        setTime: function (time) {
                            this.SUPER(this.getTime() + time);
                            if (this.getParent() != null) {
                                this.getParent().setTime(time);
                            }
                        },

                        getPassCount: function () {
                            return this.getTestCount() - (this.getFailureCount() + this.getErrorCount());
                        },

                        isFixed: function () {
                            for (var i = 0; i < this.children.length; ++i) {
                                if (this.children[i].isFixed()) return true;
                            }

                            return false;
                        },

                        hasChildren: function () {
                            return this.children.length > 0;
                        },

                        getSize: function () {
                            var count = 1;
                            for (var i = 0; i < this.children.length; ++i) {
                                count += this.children[i].getSize();
                            }

                            return count;
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