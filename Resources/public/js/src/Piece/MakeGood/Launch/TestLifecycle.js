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
        Module("Launch", function () {
            Class("TestLifecycle", {
                my: {
                    has: {
                        STATE_SUCCESS: "STATE_SUCCESS",
                        READYSTATE_UNSENT: 0,
                        READYSTATE_OPENED: 1,
                        READYSTATE_HEADERS_RECEIVED: 2,
                        READYSTATE_LOADING: 3,
                        READYSTATE_DONE: 4
                    }
                },

                has: {
                    progress: { init: new Piece.MakeGood.Core.Run.Progress() },
                    failures: { init: new Piece.MakeGood.Core.Run.Failures() },
                    testRunURI: {},
                    consoleWriter: {},
                    resultReaderListener: {},
                    onEnd: {},
                    onError: {}
                },

                after: {
                    initialize: function (props) {
                        this.testRunURI = props.testRunURI;
                        this.consoleWriter = props.consoleWriter;
                        this.resultReaderListener = props.resultReaderListener;
                        this.onEnd = props.onEnd;
                        this.onError = props.onError;
                    },

                },

                methods: {
                    start: function () {
                        this.progress.start();
                        // var testRunID = this.runTest();
                        var testRunID = "foo";
                        this.readResult(testRunID);
                    },

                    end: function () {
                        this.progress.end();
                        this.onEnd();
                    },

                    getProgress: function () {
                        return this.progress;
                    },

                    runTest: function () {
                        var self = this;
                        if (!window.XMLHttpRequest) {
                            throw new Error("Cannot use XMLHttpRequest objects.");
                        }
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", this.testRunURI);
                        xhr.send();

                        var chunkOffset = 0;
                        Deferred.next(function () {
                            switch (xhr.readyState) {
                            case self.my.READYSTATE_UNSENT:
                            case self.my.READYSTATE_OPENED:
                            case self.my.READYSTATE_HEADERS_RECEIVED:
                                break;
                            case self.my.READYSTATE_LOADING:
                            case self.my.READYSTATE_DONE:
                                if (xhr.status != 200) {
                                    throw new Error("The HTTP status code [ " + xhr.status + " ] has been returned by [ " + self.testRunURI + " ].");
                                }
                                if (xhr.responseText.length == 0) return Deferred.next(arguments.callee);
                                var chunkSizeEndOffset = xhr.responseText.indexOf(";", chunkOffset);
                                if (chunkSizeEndOffset == -1) return Deferred.next(arguments.callee);
                                var chunkDataStartOffset = chunkSizeEndOffset + 1;
                                var chunkSize = parseInt(xhr.responseText.substr(chunkOffset, chunkSizeEndOffset - chunkOffset));
                                var chunkDataEndOffset = xhr.responseText.indexOf(";", chunkDataStartOffset + chunkSize);
                                if (chunkDataEndOffset == -1) return Deferred.next(arguments.callee);

                                var chunkData = Base64.decode(xhr.responseText.substr(chunkDataStartOffset, chunkSize)).trim();
                                if (chunkData.length > 0) {
                                    self.consoleWriter.write(chunkData);
                                }

                                chunkOffset = chunkDataEndOffset + 1;
                                break;
                            }

                            return Deferred.next(arguments.callee);
                        }).error(function (e) {
                            self.end();
                            if (e != self.my.STATE_SUCCESS) {
                                self.onError(e);
                            }
                        });
                    },

                    createResultReader: function () {
                        var resultReader = new Piece.MakeGood.Core.Run.ResultReader();
                        resultReader.addListener(this.progress);
                        resultReader.addListener(this.failures);
                        resultReader.addListener(this.resultReaderListener);
                        return resultReader;
                    },

                    readResult: function(testRunID) {
                        var self = this;
                        if (!window.XMLHttpRequest) {
                            throw new Error("Cannot use XMLHttpRequest objects.");
                        }
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", this.testRunURI + "/" + encodeURIComponent(testRunID));
                        xhr.send();

                        var resultReader = this.createResultReader();
                        var chunkOffset = 0;
                        Deferred.next(function () {
                            switch (xhr.readyState) {
                            case self.my.READYSTATE_UNSENT:
                            case self.my.READYSTATE_OPENED:
                            case self.my.READYSTATE_HEADERS_RECEIVED:
                                break;
                            case self.my.READYSTATE_LOADING:
                            case self.my.READYSTATE_DONE:
                                if (xhr.status != 200) {
                                    throw new Error("The HTTP status code [ " + xhr.status + " ] has been returned by [ " + self.testRunURI + " ].");
                                }
                                if (xhr.responseText.length == 0) return Deferred.next(arguments.callee);
                                var chunkSizeEndOffset = xhr.responseText.indexOf(";", chunkOffset);
                                if (chunkSizeEndOffset == -1) return Deferred.next(arguments.callee);
                                var chunkDataStartOffset = chunkSizeEndOffset + 1;
                                var chunkSize = parseInt(xhr.responseText.substr(chunkOffset, chunkSizeEndOffset - chunkOffset));
                                var chunkDataEndOffset = xhr.responseText.indexOf(";", chunkDataStartOffset + chunkSize);
                                if (chunkDataEndOffset == -1) return Deferred.next(arguments.callee);

                                var chunkData = Base64.decode(xhr.responseText.substr(chunkDataStartOffset, chunkSize)).trim();
                                if (chunkData.length > 0) {
                                    resultReader.read(JSON.parse(chunkData));
                                    if (resultReader.isStopped()) {
                                        throw self.my.STATE_SUCCESS;
                                    }
                                }

                                chunkOffset = chunkDataEndOffset + 1;
                                break;
                            }

                            return Deferred.next(arguments.callee);
                        }).error(function (e) {
                            self.end();
                            if (e != self.my.STATE_SUCCESS) {
                                self.onError(e);
                            }
                        });
                    }
                }
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
