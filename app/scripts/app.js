	'use strict';

var peloApp = angular.module('peloApp', []);

peloApp.controller('appController', function ($scope, $window) {

	$scope.keys = [
		{ input: 1, output: "", audio: "/assets/audio/Dtmf1.ogg"},
		{ input: 2, output: "abc", audio: "/assets/audio/Dtmf2.ogg" },
		{ input: 3, output: "def", audio: "/assets/audio/Dtmf3.ogg" },
		{ input: 4, output: "ghi", audio: "/assets/audio/Dtmf4.ogg" },
		{ input: 5, output: "jkl", audio: "/assets/audio/Dtmf5.ogg" },
		{ input: 6, output: "mno", audio: "/assets/audio/Dtmf6.ogg" },
		{ input: 7, output: "pqrs", audio: "/assets/audio/Dtmf7.ogg" },
		{ input: 8, output: "tuv", audio: "/assets/audio/Dtmf8.ogg" },
		{ input: 9, output: "wxyz", audio: "/assets/audio/Dtmf9.ogg" },
		{ input: "↻", name: "reset" },
		{ input: 0, output: "", audio: "/assets/audio/Dtmf0.ogg" },
		{ input: "↩︎", name: "enter" }
	]

	$scope.inputs = [];
	$scope.rawOutput = [];
	$scope.refinedOutput = [];

	$scope.keyClicked = function (index) {
		
		// If key pressed is a number...
		if (!isNaN($scope.keys[index].input)) {
			// Play audio
			var audio = new Audio($scope.keys[index].audio);
			audio.play();

			// Collect inputs
			$scope.inputs.push($scope.keys[index].input);

			// If the input is other than 0 or 1...
			if ($scope.keys[index].input != 0 && $scope.keys[index].input != 1) {
				// Push to raw output collection for processing
				$scope.rawOutput.push($scope.keys[index].output);							
			}			
		} 
		// If key pressed is the Reset button...
		else if ($scope.keys[index].name == "reset") {
			// Empty out all variables
			$scope.inputs = [];
			$scope.rawOutput = [];
			$scope.refinedOutput = [];
			$scope.noComboMessage = null;
		}

		// If key pressed is the Enter button...
		else {
			// If the raw output has not been processed yet...
			if (!$scope.refinedOutput.length) {
				// Start the madness!
				refineOutput($scope.rawOutput, $scope.rawOutput.length);	
			}
		}
		
	}

	$scope.getComboTotal = function (array) {
		var total = 1;
		for (var x=0; x < array.length; x++) {
			if (array[x].length != 0) {
				total = total * array[x].length;	
			}			
		}
		return total;
	}

	var refineOutput = function (raw, length) {
		var combo = [];
		var refined = [];
		// Here we go...
		recursion(raw, 0, combo, length);
	}

	var recursion = function (raw, digit, combo, length) {

		if (digit == length) {

			// Start a new combination string
			var comboString = "";
			// For each letter in the combination array...
			for (var x=0; x < combo.length; x++) {
				// Concatenate to the combination string
				comboString += combo[x];	
			}

			// Push finished combination to the refined collection
			$scope.refinedOutput.push(comboString);

			// If the refined collection has filled up to the total number of combos possible...
			if ($scope.refinedOutput.length == $scope.getComboTotal(raw)) {				
				// If the first value is empty...
				if ($scope.refinedOutput[0].length == 0) {
					$scope.refinedOutput.length = 0;
					$scope.noComboMessage = "No possible combinations.";
				}
			}
			return;
		}

		// If the current input is 0 or 1...
		if (raw[digit] == 0 || raw[digit] == 1) {
			// Remove it from the raw output collection and continue processing
			raw.splice(digit, 1);
			if (digit != 0) {
				digit -= 1;	
			}			
			length = raw.length;
		}

		// If we have more to process...
		if (raw[digit]) {
			// Continue the loop
			for (var i=0; i < raw[digit].length; i++) {
				combo[digit] = raw[digit][i];
				recursion(raw, parseInt(digit+1), combo, length);				
			}
		}
		
	}

});