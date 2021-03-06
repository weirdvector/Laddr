laddrControllers.controller('PostingsDetailController', ['$scope', '$location', '$http', '$routeParams', 'LoginService',
  function($scope, $location, $http, $routeParams, LoginService) {

  $scope.posting = {};
  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 13 };

  if (LoginService.isLoggedIn() != undefined) {

    $http
      .get('/api/posting/' + $routeParams.id, {
        headers: {
          'x-access-token': LoginService.getToken()
        }
      })
      .success(function(data, status, headers, config) {

        $scope.posting = data;
        $scope.map.center.latitude = $scope.posting.Lat;
        $scope.map.center.longitude = $scope.posting.Lng;
        $scope.marker = {
          id: 0,
          coords: {
            latitude: $scope.posting.Lat,
            longitude: $scope.posting.Lng
          },
          options: { draggable: false }
        };

        // deadline display
        deadline = new Date($scope.posting.Deadline);
        today = new Date();
        $scope.daysRemaining = Math.round((deadline.getTime() - today.getTime()) / 86400000); //milliseconds per day
        if ($scope.daysRemaining == 0) {
          $scope.daysLeft = "Applications close today!";  
        } else if ($scope.daysRemaining == 1) {
          $scope.daysLeft = "Applications close in 1 day.";
        } else if ($scope.daysRemaining > 1) {
          $scope.daysLeft = "Applications close in " + $scope.daysRemaining + " days.";
        } else {
          $scope.daysLeft = "Applications are closed.";
        }

        // make note of visit
        data = {
          ProfileID: LoginService.getProfile().ProfileID,
          PostingID: $scope.posting.PostingID
        }

        $http.post('/api/profiletags', data, {
          headers: {
            'x-access-token': LoginService.getToken()
          }
        })
        .success(function(data, status, headers, config) {
          // console.log('ProfileTags data: ' + data);
        })
        .error(function(data, status, headers, config) {
          // console.log('ProfileTags error: ' + data);
        });
      })
      .error(function(data, status, headers, config) {
        //couldn't get postings
        $scope.message = 'Could not retrieve posting. Please try again later.';
      });
  } else {
    $location.url('/login');
  }

  $scope.apply = function() {
    // logged in user applies to posting
    today = new Date().getTime();
    deadline = new Date($scope.posting.Deadline).getTime();

    if (deadline >= today) {
      $http
        .post('/api/apply', $scope.posting, {
          headers: {
            'x-access-token': LoginService.getToken()
          }
        })
        .success(function(data, status, headers, config) {
          if (data.success == true) {
            $location.url('/applications');
          } else {
            $scope.applyError = data.message;
          }
        })
        .error(function(data, status, headers, config) {
          $scope.applyError = 'Sorry, there was a problem applying to the job. Please try again later.';
        });
    } else {
      $scope.applyError = 'Sorry, applications are closed.';
    }

  };

}]);
