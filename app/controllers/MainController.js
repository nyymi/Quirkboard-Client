module.exports = function($scope, $http, config) {

    $scope.config = config;
    $scope.submitError = false;
    $scope.submitStatus = '';
    $scope.boards = {};
    $scope.selectedBoard = {};
    $scope.selectedThread = {
        id: -1
    };
    $scope.newThread = {
        subject: '',
        message: ''
    };
    $scope.newMessage = {
        message: ''
    };
    $scope.uploadFile = {
        file: null
    };

    $scope.selectBoard = function(board) {
        $scope.selectedThread = {
            id: -1
        };
        $scope.selectedBoard = board;
        $scope.getThreads(board);
        $scope.getBoardStats(board);
    }

    $scope.selectThread = function(thread) {
        $scope.selectedThread = thread;
        $scope.getMessages(thread);
    }

    $scope.getBoards = function() {
        $http.get(config.appAPI + 'boards')
            .success(function(data, status, headers, config) {
                $scope.boards = data;

                if ($.isEmptyObject($scope.selectedBoard)) {
                    $scope.selectBoard($scope.boards[0]);
                }
            })
            .error(function(data, status, header, config) {
                console.log('Error: Couldnt get boards as a json object.');
            });
    }

    $scope.getBoardStats = function(board) {
        $http.get(config.appAPI + 'boards/' + board.id + '/stats')
            .success(function(data, status, headers, config) {
                board.stats = data;
            })
            .error(function(data, status, header, config) {
                console.log('Error: Couldnt get board stats as a json object.');
            });
    }

    $scope.getThreads = function(board) {
        $http.get(config.appAPI + 'threads/' + board.id)
            .success(function(data, status, headers, config) {
                board.threads = data;

                board.threads.forEach(function(thread) {
                    $scope.getMessages(thread);
                });
            })
            .error(function(data, status, header, config) {
                console.log('Error: Couldnt get threads as a json object.');
            });
    }

    $scope.getMessages = function(thread) {
        $http.get(config.appAPI + 'messages/' + thread.id)
            .success(function(data, status, headers, config) {
                thread.messages = data;
            })
            .error(function(data, status, header, config) {
                console.log('Error: Couldnt get messages as a json object.');
            });
    }

    $scope.postThread = function(thread, file, board) {

        var filesrc = document.getElementById('fileThread').value;

        if (filesrc) {
            thread.filesrc = filesrc;
        }

        $http({
            method: 'POST',
            url: config.appAPI + 'threads/' + board.id,
            data: JSON.stringify({
                thread
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            $scope.submitStatus = 'Success.';
            $scope.submitError = false;
            $scope.newThread.subject = '';
            $scope.uploadFile.file = null;
            $scope.newThread.message = '';
            $scope.getThreads(board);
        }, function error(response) {
            $scope.submitStatus = 'Error: Couldnt post a new thread.';
            $scope.submitError = true;
            console.log($scope.submitStatus);
        });
    }

    $scope.postMessage = function(message, file, thread) {

        var filesrc = document.getElementById('fileMessage').value;

        if (filesrc) {
            message.filesrc = filesrc;
        }

        $http({
            method: 'POST',
            url: config.appAPI + 'messages/' + thread.id,
            data: JSON.stringify({
                message
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            $scope.submitStatus = 'Success.';
            $scope.submitError = false;
            $scope.uploadFile.file = null;
            $scope.newMessage.message = '';
            $scope.getMessages(thread);
        }, function error(response) {
            $scope.submitStatus = 'Error: Couldnt post a new message.';
            $scope.submitError = true;
            console.log($scope.submitStatus);
        });
    }

    $scope.getBoards();
}
