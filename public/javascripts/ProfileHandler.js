angular.module("Profile",[])
    .controller("ProfileController",['$http','$scope',function($http,$scope){
        //var cu;
        $scope.getCurrentUser = function(){
           $http({
               method: 'POST',
               url: '/getCurrentUser',
           }).success(function(data){
                $scope.results = data[0].username;
               //cu = $scope.currentUserName;
           });
       }

        $scope.allTweets = [];
        $scope.getTweetsByUser = function() {
            var username = document.getElementById('searchedUserName').innerHTML;
            console.log('Searched User Name: '+username);
            //console.log("Fetch by user");
            $http({
                method: 'GET',
                url: '/getTweetsByUser',
                data: {'username' : username}
            }).success(function (data) {
                $scope.allTweets = data;
            }).error(function (err) {
                console.log(err);
            });
        };

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

        $scope.follow = function(){
            var username = document.getElementById('searchedUserName').innerHTML;
            console.log(username);
            $http({
                method: 'POST',
                url: '/follow',
                data: {'follow' : username}
            }).success(function(data){
                console.log('Follower Added!');
            });

        }

    }]);
