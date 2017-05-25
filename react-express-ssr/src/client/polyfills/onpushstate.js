((history) => { // idea from http://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate#answer-4585031
	const pushState = history.pushState;

	history.pushState = (...args) => {
		let event;
		let state = args[0];

		if (window.CustomEvent) { // see also https://github.com/oneuijs/You-Dont-Need-jQuery (search by "Trigger")
			event = new CustomEvent('pushstate', state);
		}
		else {
			event = document.createEvent('CustomEvent');
			event.initCustomEvent('pushstate', state);
		}

		let result = pushState.apply(history, args);

		window.dispatchEvent(event);

		return result;
	};
})(window.history);
