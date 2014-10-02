'use strict';

/**controllers*/
var authFailed = false;
var url = 'http://localhost:8080/scout.me.out.api/file/upload/image/j.ant.wallace@gmail.com/2';

angular.module('mbs.controllers', [])
        .controller('MainCtrl', ['$scope', 'geolocation', function ($scope, geolocation) {
            // app.initialize();
            geolocation.getCurrentPosition(function (position) {
                alert(position);
                alert('Latitude: ' + position.coords.latitude + '\n' +
                      'Longitude: ' + position.coords.longitude + '\n' +
                      'Altitude: ' + position.coords.altitude + '\n' +
                      'Accuracy: ' + position.coords.accuracy + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                      'Heading: ' + position.coords.heading + '\n' +
                      'Speed: ' + position.coords.speed + '\n' +
                      'Timestamp: ' + position.timestamp + '\n');
            });
        }])}])
	   .controller('barberShopController', ['$scope', 'MbsAPI', 'PlacesAPI', '$routeParams', '$location', '$stateParams', '$sce', function ($scope, MbsAPI, PlacesAPI, $routeParams, $location, $stateParams, $sce) {

	       /*updateNavLeft("", 
				   $("<a/>").append($("<span/>").addClass("glyphicon glyphicon-chevron-left")).text("Back")
		   );*/

	       //<a href="index.html" onclick="getPageView('barbershop.html', 'index.html', null, true)"><span class=""></span> Back</a>
	       var searchObject = $location.search();
	       var barberShopID = 1002;//parseInt($stateParams.barberShopID, 10);
           
	       $scope.shopImage;
	       $scope.shopAddress;
	       $scope.shopCityState;

	       $scope.getUser = function () {
	           $scope.userInfo = MbsAPI.getUserProfile({
	               call: "login/gather", values: $scope.mbsProfileID,
	               accountType: getAccountType($scope.mbsAccountType)
	           },
                   function (data) {
                       if (data && data.response.success) {

                       } else {
                           //error getting user data
                       }

                       //showNavigation("search");
                   });
	       }
	       $scope.getBarberShopDetails = function () {

	           showLoadingBar("Loading barber shop information...");

	           $scope.shopInfo = MbsAPI.getBarberShopDetails({
	               call: "barbershop/gather/details", barberShopID: barberShopID
	           },
                   function (data) {
                       if (data && data.response.success) {
                           if (data.barberShop) {
                               buildBarberShopDetail(data.barberShop, $scope);
                               
                               $scope.shopImage = getProfileImage($scope.currentBarberShops[0].image, "barberShop");
                               $scope.shopAddress = formatAddressReverse($scope.currentBarberShops[0].address, "Street");
                               $scope.shopCityState = formatAddressReverse($scope.currentBarberShops[0].address, "CityState");
                               /*$("#hoursOfOperationDiv").append(getHoursOfOperation($scope.currentBarberShops[0].hoursOfOperation))
                               $("#shopSpecialtiesDiv").append(getSpecialties($scope.currentBarberShops[0].barberShopSpecialties));
                               $("#shopBarbers").append(renderBarbers($scope.currentBarberShops[0].barbers, $scope));

                               var gallery = renderGallery($scope.currentBarberShops[0].images, "#shopGallery");

                               if (gallery != null)
                                   $("#shopGallery").append(gallery);

                               $("#shopCustomers").append(renderCustomers($scope.currentBarberShops[0].customers));

                               //renderBarberShopDetails($scope);
                               /* blueimp.Gallery(
                                         document.getElementById('links').getElementsByTagName('a'),
                                         {
                                             container: '#blueimp-gallery',
                                             carousel: true,
                                             fullScreen: true
                                         }
                                     );*/ 
                               /*var dateCreated = new Date(Date.parse(customer.dateCreated));
            
                               $scope.month = getReadableMonth(dateCreated.getMonth());
                               $scope.date = dateCreated.getDate();
                               $scope.year = dateCreated.getFullYear();*/
                               //$scope.customers = renderCustomers($scope.currentBarberShops[0].customers);
                               renderCustomers($scope.currentBarberShops[0].customers, $sce);
                           }
                       }

                       removeLoadingBar();
                   });
	       }
	       $scope.showAlert = function(e)
	       {
	           alert("hi");
	       }

	       getUserData($scope);

	       $scope.getBarberShopDetails();
	   }])
	   .controller('barberController', ['$scope', 'MbsAPI', 'PlacesAPI', '$routeParams', '$location', function ($scope, MbsAPI, PlacesAPI, $routeParams, $location) {

	       var searchObject = $location.search();

	       $scope.barberImage;
	       $scope.isAvailable;
	       $scope.isAppointments;
	       $scope.isAppointment;
	       $scope.isVacationing;
	       $scope.vacationPeriod;
	       $scope.isReadonly = true;
	       $scope.isBarber = false;
	       $scope.percent = 0;

	       $scope.getUser = function () {
	           $scope.userInfo = MbsAPI.getUserProfile({
	               call: "login/gather", values: $scope.mbsProfileID,
	               accountType: getAccountType($scope.mbsAccountType)
	           },
                   function (data) {
                       if (data && data.response.success) {

                       } else {
                           //error getting user data
                       }

                       //showNavigation("search");
                   });
	       }
	       $scope.getBarberDetails = function () {
	           $scope.shopInfo = MbsAPI.getBarberShopDetails({
	               call: "barber/gather/details", barberID: searchObject.barberID
	           },
                   function (data) {
                       if (data && data.response.success) {
                           if (data.member) {
                               buildBarberProfile(data.member, $scope);

                               $scope.barberImage = getProfileImage($scope.currentBarber.profile.image, "barber");
                               $scope.isAvailable = convertBoolean($scope.currentBarber.barberStatus.isAvailable);
                               $scope.isAppointments = convertBoolean($scope.currentBarber.acceptsAppointments);
                               $scope.isAppointment = $scope.currentBarber.acceptsAppointments == "false" ? true : false;
                               $scope.isVacationing = convertBoolean($scope.currentBarber.barberStatus.isOnVacation);
                               $scope.isBarber = $scope.currentBarber.profileID == $scope.mbsProfileID ? true : false;

                               if ($scope.currentBarber.barberStatus.vacationStartDate && $scope.currentBarber.barberStatus.vacationEndDate) {
                                   $scope.vacationPeriod = formatDateNoTime(new Date($scope.currentBarber.barberStatus.vacationStartDate)) + " - " +
                            	   					formatDateNoTime(new Date($scope.currentBarber.barberStatus.vacationEndDate))
                               }

                               $("#barberScheduleDiv").append(getHoursOfOperation($scope.currentBarber.barberSchedule));
                               $("#barberSpecialtiesDiv").append(getSpecialties($scope.currentBarber.barberSpecialties));

                               var gallery = renderGallery($scope.currentBarber.barberImages, "#barberGallery");

                               if (gallery != null)
                                   $("#barberGallery").append(gallery);

                               $("#barberClients").append(renderClients($scope.currentBarber.barberClients));
                               /*$("#shopBarbers").append(renderBarbers($scope.currentBarberShops[0].barbers));
                              
                              //renderBarberShopDetails($scope);
                             /* blueimp.Gallery(
                                       document.getElementById('links').getElementsByTagName('a'),
                                       {
                                           container: '#blueimp-gallery',
                                           carousel: true,
                                           fullScreen: true
                                       }
                                   );*/
                               $scope.currentBarber.rating.ratingCalc = calculateRating($scope.currentBarber.rating.rating, 10);
                               var total = parseInt($scope.currentBarber.rating.upCount) + parseInt($scope.currentBarber.rating.downCount);
                               $scope.currentBarber.rating.ratingUpPercent = calculateRatingCounts($scope.currentBarber.rating.upCount, total);
                               $scope.currentBarber.rating.ratingDownPercent = calculateRatingCounts($scope.currentBarber.rating.downCount, total);
                           }
                       }
                   });
	       }
	       $scope.rateBarber = function (upCount, downCount, isUp) {

	           postStatusMessage("Saving barber rating", "info");

	           if ($scope.currentBarber.rating && $scope.currentBarber.rating.ratingID == "0") {
	               if (downCount == 0)
	                   upCount = parseInt(upCount) + 1;
	               else
	                   if (upCount == 0)
	                       downCount = parseInt(downCount) + 1;

	               $scope.createRating = MbsAPI.createBarberRating({
	                   call: "rating/barber/create", values: $scope.mbsProfileID, rating: $scope.currentBarber.rating.rating,
	                   upCount: upCount, downCount: downCount, barberID: searchObject.barberID
	               },
	                   function (data) {
	                       if (data && data.response.success) {
	                           if (data.member) {

	                               $scope.currentBarber.rating.rating = data.member.rating;
	                               $scope.currentBarber.rating.ratingID = data.member.ratingID;
	                               $scope.currentBarber.rating.upCount = data.member.upCount;
	                               $scope.currentBarber.rating.downCount = data.member.downCount;
	                               $scope.currentBarber.rating.dateCreated = data.member.dateCreated;
	                               $scope.currentBarber.rating.barberID = data.member.barberID;

	                               $scope.currentBarber.rating.ratingCalc = calculateRating($scope.currentBarber.rating.rating, 10);
	                               var total = parseInt($scope.currentBarber.rating.upCount) + parseInt($scope.currentBarber.rating.downCount);
	                               $scope.currentBarber.rating.ratingUpPercent = calculateRatingCounts($scope.currentBarber.rating.upCount, total);
	                               $scope.currentBarber.rating.ratingDownPercent = calculateRatingCounts($scope.currentBarber.rating.downCount, total);

	                               updateStatusMessage("Barber rating saved successfully", "success");
	                           } else
	                               updateStatusMessage("could not save barber rating", "error");
	                       }
	                   });
	           } else {
	               if (isUp) {
	                   downCount = 0;
	                   upCount = $scope.currentBarber.rating.upCount == "0" ? parseInt($scope.currentBarber.rating.upCount) + 1 : $scope.currentBarber.rating.upCount;
	               }
	               else {
	                   downCount = $scope.currentBarber.rating.downCount == "0" ? parseInt($scope.currentBarber.rating.downCount) + 1 : $scope.currentBarber.rating.downCount;
	                   upCount = 0;
	               }

	               $scope.updateRating = MbsAPI.createBarberRating({
	                   call: "rating/barber/update", values: $scope.mbsProfileID, rating: $scope.currentBarber.rating.rating,
	                   upCount: upCount, downCount: downCount, barberID: searchObject.barberID, ratingID: $scope.currentBarber.rating.ratingID
	               },
	                   function (data) {
	                       if (data && data.response.success) {
	                           if (data.member) {

	                               $scope.currentBarber.rating.rating = data.member.rating;
	                               $scope.currentBarber.rating.upCount = data.member.upCount;
	                               $scope.currentBarber.rating.downCount = data.member.downCount;

	                               $scope.currentBarber.rating.ratingCalc = calculateRating($scope.currentBarber.rating.rating, 10);
	                               var total = parseInt($scope.currentBarber.rating.upCount) + parseInt($scope.currentBarber.rating.downCount);
	                               $scope.currentBarber.rating.ratingUpPercent = calculateRatingCounts($scope.currentBarber.rating.upCount, total);
	                               $scope.currentBarber.rating.ratingDownPercent = calculateRatingCounts($scope.currentBarber.rating.downCount, total);

	                               updateStatusMessage("Barber rating saved successfully", "success");
	                           } else
	                               updateStatusMessage("could not save barber rating", "error");
	                       }
	                   });
	           }
	       }
	       $scope.getAppointmentUrl = function (barberID) {
	           getPageView("barber.html", "appointment.html", "barberID=" + barberID, false);
	           //window.location = document.URL.substring(0, document.URL.indexOf("?")).replace("barber.html", "appointment.html?barberID=" + barberID);
	       }
	       $scope.showRating = function () {
	           $('#ratingContainer').css('display', 'block');
	       }
	       $scope.hoveringOver = function (value) {
	           $scope.overStar = value;
	           $scope.percent = 100 * (value / 10);
	       };

	       getUserData($scope);

	       $scope.getBarberDetails();
	   }]);