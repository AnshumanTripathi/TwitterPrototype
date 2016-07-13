angular.module('Tweets',[])
    .controller('TweetHandler',['$http','$scope',function($http,$scope){
        $scope.allTweets = [];
        $scope.getTweets = function() {
            $http({
                method: 'GET',
                url: '/getTweets'
            }).success(function (data) {
                $scope.allTweets = data;
            }).error(function (err) {
                console.log(err);
            });
        };
        $scope.postTweet = function(){
            $http({
                method: 'POST',
                url: '/tweet',
                data:{'tweet':$scope.tweet}
            }).success(function(data){
                if(data) {
                    $scope.getTweets();
                }
            }).error(function(err){
                alert("Error :"+err);
            });
        }

        $scope.logout = function(){
            $http(
                {
                    method: 'POST',
                    url: '/logout'
                }
            ).success(function(data){
                window.location.assign('/');
            });
        }

        $scope.searchResults = [];
        $scope.searchUsers = function(){
            if($scope.search.charAt(0) != '#') {
                $http({
                    method: 'POST',
                    url: '/search',
                    data: {'searchStr': $scope.search}
                }).success(function (data) {
                    $scope.searchResults = data;
                });

            }else
            if($scope.search.charAt(0) == '#'){

                var hashTag = $scope.search;
                hashTag = hashTag.substr(1);
                console.log("HashTag is: "+hashTag)
                $http({
                    method: 'POST',
                    url: '/searchTweet',
                    data: {'searchStr': hashTag}
                }).success(function(data){
                    $scope.searchResults = data;
                });
            }
            document.getElementById('suggestions').style = 'display: block';
        }

    }]);