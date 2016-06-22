// a script containing testing utilities and test functions

(function() {

var RUN_TESTS = true;
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

// test the randInt function
function testRandInt() {
	for (var i = 0; i < 1000; i++) {
		for (var j = 0; j < 10; j++) {
			var rand = randInt(0, i);
			assert(rand >= 0 && rand <= i, "randInt failed for 0, " + i.toString());
		}
	}
}

// test the rectsOverlap function
function testRectsOverlap() {
	function test(a, b, target) {
		assert(rectsOverlap(a, b) == target);
		assert(rectsOverlap(b, a) == target);
	}
	r1 = { x: 0, y: 0, height: 50, width: 50 };
	r2 = { x: 0, y: 0, height: 50, width: 50 };
	test(r1, r2, true);
	r1.x = -50;
	test(r1, r2, false);
	r1.x = -49;
	test(r1, r2, true);
	r1.y = -50;
	test(r1, r2, false);
	r1.y = -49;
	test(r1, r2, true);
	r3 = { x: -10, y: -10, height: 10, width: 10 };
	r4 = { x: 0, y: 0, height: 50, widht: 50 };
	test(r3, r4, false);
}

// run all the test functions that are passed as arguments
function run_tests() {
	if (!RUN_TESTS) return;
	var fail_count;
	for (var i = 0; i < arguments.length; i++) {
		try {
			arguments[i]();
		} catch (e) {
			console.log("Test failed: " + arguments[i].name);
			console.log(e);
			fail_count++;
		}
	}
	if (fail_count) {
		console.log("Summary: failed " + fail_count.toString + "/" + arguments.length + " tests");
	} else console.log("All tests successful");
}

run_tests(
	testRandInt,
	testRectsOverlap
);

})();